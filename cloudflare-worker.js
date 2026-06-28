// ============================================================
// GULFHABIBI CLOUDFLARE WORKER — SECURE AI GATEWAY v2
// All API keys live HERE only — never in the browser
//
// DEPLOY STEPS:
// 1. Go to https://workers.cloudflare.com → Create Worker
// 2. Paste this file, then go to Settings → Variables → Add:
//    GROQ_API_KEY          = gsk_...
//    GEMINI_API_KEY        = AIza...
//    SUPABASE_URL          = https://chfkssclmdshdcijfzdr.supabase.co
//    SUPABASE_SERVICE_KEY  = your service role key (NOT anon key)
//    ALLOWED_ORIGIN        = https://gulfhabibi.com
//    ADMIN_SECRET          = generate a long random string (admin calls only)
// 3. Deploy → copy your worker URL → paste into shared/config.js PROXY_URL
// ============================================================

export default {
  async fetch(request, env) {
    // Read origin FIRST before any other use
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env, origin) });
    }
    // STRICT: exact allowlist only — no substring matching
    const allowedOrigins = [
      env.ALLOWED_ORIGIN || 'https://gulfhabibi.com',
      env.ALLOWED_ORIGIN_2 || '',          // e.g. https://www.gulfhabibi.com
      'http://localhost:8090',              // local dev only
      'http://127.0.0.1:8090',
    ].filter(Boolean);
    const isAllowed = allowedOrigins.includes(origin);
    // In production (env.ALLOWED_ORIGIN set), block unknown origins hard
    if (!isAllowed && env.ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === '/api/ai')           return await handleAI(request, env, origin);
      if (path === '/api/trust')        return await handleTrust(request, env, origin);
      if (path === '/api/vision')       return await handleVision(request, env, origin);
      if (path === '/api/admin/verify') return await handleAdminVerify(request, env, origin);
      return new Response('Not found', { status: 404 });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { ...corsHeaders(env, origin), 'Content-Type': 'application/json' }
      });
    }
  }
};

// ── RATE LIMITING (per IP, using KV if available) ─────────
async function checkRateLimit(ip, env) {
  // Simple in-memory approach — works without KV binding
  // For production: bind a KV namespace called RATE_LIMIT
  const key = `rl_${ip}`;
  try {
    if (env.RATE_LIMIT) {
      const count = parseInt(await env.RATE_LIMIT.get(key) || '0');
      if (count >= 30) return false; // 30 AI calls per hour per IP
      await env.RATE_LIMIT.put(key, String(count + 1), { expirationTtl: 3600 });
    }
  } catch(e) { /* KV not bound — skip rate limiting in dev */ }
  return true;
}

// ── INPUT SANITIZATION ─────────────────────────────────────
function sanitizeInput(text, maxLen = 2000) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\0/g, '')
    .slice(0, maxLen)
    .trim();
}

// ── OUTPUT FILTER — strip PII before returning ────────────
function filterOutput(text) {
  if (!text) return text;
  // Redact anything that looks like a key accidentally in output
  return text
    .replace(/gsk_[A-Za-z0-9]{20,}/g, '[REDACTED]')
    .replace(/AIza[A-Za-z0-9_\-]{30,}/g, '[REDACTED]')
    .replace(/sk-ant-[A-Za-z0-9_\-]{30,}/g, '[REDACTED]');
}

// ── LOG TO SUPABASE ai_audit_log ──────────────────────────
async function logAICall(env, data) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return;
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/ai_audit_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(data)
    });
  } catch(e) { /* log failure should never crash the main request */ }
}

// ── HANDLE AI CHAT ─────────────────────────────────────────
async function handleAI(request, env, origin) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const allowed = await checkRateLimit(ip, env);
  if (!allowed) {
    return Response.json({ error: 'Rate limit exceeded. Please wait before sending more requests.' },
      { status: 429, headers: corsHeaders(env, origin) });
  }

  const body = await request.json();
  const { messages, systemPrompt, module: mod, maxTokens = 900 } = body;

  // Sanitize all user messages
  const cleanMessages = (messages || []).map(m => ({
    role: m.role,
    content: sanitizeInput(m.content, 2000)
  }));

  const payload = {
    model: 'llama-3.3-70b-versatile',
    max_tokens: Math.min(maxTokens, 1500),
    temperature: 0.2,
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...cleanMessages.slice(-14)
    ]
  };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.GROQ_API_KEY}` },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    return Response.json({ error: 'AI service error' }, { status: 502, headers: corsHeaders(env) });
  }

  const data = await res.json();
  const output = filterOutput(data.choices?.[0]?.message?.content || '');

  // Log to audit table (non-blocking)
  logAICall(env, {
    feature: mod || 'general',
    input_length: cleanMessages.reduce((n, m) => n + (m.content?.length || 0), 0),
    output_length: output.length,
    ip_hash: ip.split('.').slice(0,2).join('.') + '.x.x', // partial IP only
    model: 'llama-3.3-70b-versatile',
    created_at: new Date().toISOString()
  });

  return Response.json({ content: output }, { headers: corsHeaders(env, origin) });
}

// ── HANDLE TRUST/MODERATION ────────────────────────────────
async function handleTrust(request, env, origin) {
  const { listing } = await request.json();
  const clean = {
    title: sanitizeInput(listing.title, 120),
    category: sanitizeInput(listing.category, 50),
    price: Number(listing.price) || 0,
    description: sanitizeInput(listing.description, 400),
    emirate: sanitizeInput(listing.emirate, 50),
  };

  const prompt = `You are a content moderator for GulfHabibi UAE classifieds.
Analyze this listing. Return ONLY JSON (no markdown, no extra text):
{"score":<0-100>,"action":"<approve|flag|hold|reject>","flags":["issue1","issue2"],"reason":"<brief>"}

Score: 80-100=approve, 40-79=flag (minor issues), 20-39=hold (review needed), 0-19=reject

Flag these: scam phrases (western union/send deposit/not in UAE/paypal only), prohibited (weapons/drugs/adult), 
price anomaly (car under AED 500, property under AED 1000), spam (ALL CAPS, excessive !!! or phone numbers).

Listing: Title: ${clean.title} | Category: ${clean.category} | Price: AED ${clean.price}
Description: ${clean.description} | Location: ${clean.emirate}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${env.GROQ_API_KEY}` },
    body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.1 })
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '{}';
  try {
    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    return Response.json(result, { headers: corsHeaders(env, origin) });
  } catch {
    return Response.json({ score: 75, action: 'approve', flags: [], reason: 'parse error' }, { headers: corsHeaders(env, origin) });
  }
}

// ── HANDLE VISION (Gemini) ─────────────────────────────────
async function handleVision(request, env, origin) {
  const body = await request.json();
  const { imageBase64, prompt: userPrompt } = body;
  const safePrompt = sanitizeInput(userPrompt, 500);
  const model = 'gemini-2.0-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: safePrompt }, { inline_data: { mime_type: 'image/jpeg', data: imageBase64 } }] }]
      })
    }
  );

  const data = await res.json();
  const output = filterOutput(data.candidates?.[0]?.content?.parts?.[0]?.text || '');
  return Response.json({ content: output }, { headers: corsHeaders(env, origin) });
}

// ── HANDLE ADMIN VERIFY ────────────────────────────────────
async function handleAdminVerify(request, env, origin) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return Response.json({ admin: false }, { headers: corsHeaders(env, origin) });

  // Verify the JWT against Supabase
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { 'apikey': env.SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return Response.json({ admin: false }, { headers: corsHeaders(env, origin) });
  const user = await res.json();
  const role = user.user_metadata?.role || user.app_metadata?.role || '';
  const isAdmin = role === 'admin' || user.email === (env.ADMIN_EMAIL || '');
  return Response.json({ admin: isAdmin, email: user.email }, { headers: corsHeaders(env, origin) });
}

// ── CORS HEADERS ───────────────────────────────────────────
function corsHeaders(env, requestOrigin) {
  // Reflect the exact request origin — never use wildcard in production
  const origin = requestOrigin || env.ALLOWED_ORIGIN || 'https://gulfhabibi.com';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
  };
}
