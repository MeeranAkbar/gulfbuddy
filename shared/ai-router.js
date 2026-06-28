// ===== GULFHABIBI AI ROUTER — SECURE PROXY VERSION =====
// ⚠️  NO API KEYS HERE — all requests go through your Cloudflare Worker
// Requires: shared/config.js loaded first (for PROXY_URL + GROQ_MODEL)

const GBai = {

  _proxyUrl() {
    return (typeof PROXY_URL !== 'undefined' && PROXY_URL) ? PROXY_URL : '';
  },

  // ── Internal: call the worker's /api/ai endpoint ────────
  async _call(messages, systemPrompt = '', mod = 'general', maxTokens = 900) {
    const proxyUrl = this._proxyUrl();
    if (!proxyUrl || proxyUrl.includes('YOUR-NAME')) {
      throw new Error('PROXY_URL not set. Deploy cloudflare-worker.js first, then update PROXY_URL in shared/config.js');
    }
    const res = await fetch(`${proxyUrl}/api/ai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: Array.isArray(messages) ? messages : [{ role: 'user', content: messages }],
        systemPrompt,
        module: mod,
        maxTokens
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `AI gateway error ${res.status}`);
    }
    const data = await res.json();
    return data.content;
  },

  // ── Public methods (same API as before — drop-in replacement) ─
  async chat(messages, systemPrompt = '') {
    return this._call(messages, systemPrompt, 'general');
  },

  async security(text) {
    const prompt = `You are a content moderator for a UAE classifieds platform.
Analyse this listing text and return ONLY valid JSON — no extra text.
{"spam":boolean,"scam":boolean,"prohibited":boolean,"score":0-10,"reason":"brief reason"}
Text: ${String(text).substring(0, 500)}`;
    try {
      const raw = await this._call(prompt, '', 'moderation', 200);
      return JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g, '').trim());
    } catch {
      return { spam: false, scam: false, prohibited: false, score: 0, reason: 'scan failed' };
    }
  },

  async vision(imageBase64, prompt) {
    const proxyUrl = this._proxyUrl();
    if (!proxyUrl || proxyUrl.includes('YOUR-NAME')) throw new Error('PROXY_URL not set');
    const res = await fetch(`${proxyUrl}/api/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, prompt })
    });
    if (!res.ok) throw new Error('Vision gateway error ' + res.status);
    return (await res.json()).content || '';
  },

  async geminiText(prompt) {
    // Gemini text also routed through vision endpoint without image
    const proxyUrl = this._proxyUrl();
    if (!proxyUrl || proxyUrl.includes('YOUR-NAME')) throw new Error('PROXY_URL not set');
    const res = await fetch(`${proxyUrl}/api/vision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Gemini gateway error ' + res.status);
    return (await res.json()).content || '';
  },

  async scanPhoto(imageBase64) {
    const prompt = `Check if this image contains real estate agency watermarks or logos from: 
Betterhomes, Allsopp, haus & haus, Bayut, Dubizzle, Property Finder, Hamptons, Savills, CBRE, JLL.
Return ONLY valid JSON: {"hasWatermark":boolean,"agencyName":"name or null","confidence":"high/medium/low"}`;
    try {
      const raw = await this.vision(imageBase64, prompt);
      return JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g, '').trim());
    } catch {
      return { hasWatermark: false, agencyName: null, confidence: 'low' };
    }
  },

  async writeDescription(details, type = 'property') {
    const prompts = {
      property: `Write a professional UAE property listing description in 3-4 sentences. Details: ${details}. Style: clear, attractive, factual. Return ONLY the description text.`,
      vehicle:  `Write a professional UAE car listing description in 2-3 sentences. Details: ${details}. Return ONLY the description text.`,
      service:  `Write an attractive UAE service deal description in 2-3 sentences. Details: ${details}. Return ONLY the description text.`,
      job:      `Write a professional UAE job description in 3-4 sentences. Details: ${details}. Return ONLY the description text.`
    };
    try {
      return await this._call(prompts[type] || prompts.property, '', 'writer', 400);
    } catch {
      const fallback = {
        property: `Well-presented property available in the UAE. ${details}. Contact today for more information and viewing arrangements.`,
        vehicle: `Well-kept vehicle available in the UAE. ${details}. Serious buyers can get in touch for more information, viewing and discussion.`,
        service: `Professional service available in the UAE. ${details}. Contact now for availability, pricing and booking details.`,
        job: `Opportunity available in the UAE. ${details}. Reach out for the full role details and next steps.`
      };
      return fallback[type] || fallback.property;
    }
  },

  async marketing(type, details) {
    const prompts = {
      instagram: `Write an Instagram caption for this UAE listing. Max 150 chars + 5 relevant UAE hashtags. Details: ${details}`,
      whatsapp:  `Write a WhatsApp broadcast message for UAE residents about this listing. Details: ${details}. Friendly, short, clear CTA. Max 3 lines.`,
      email:     `Write a short email subject line and first paragraph for this UAE listing. Details: ${details}. Return: Subject: [subject] then body.`
    };
    return this._call(prompts[type] || prompts.whatsapp, '', 'marketing', 300);
  }
};

window.GBai = GBai;
