// ===== GULFHABIBI PLATFORM CONFIG =====
// ⚠️  NO API KEYS HERE — all keys live in the Cloudflare Worker
// Browser only knows the Supabase URL + anon key (safe — public by design)
// and the PROXY_URL which is your own Cloudflare Worker endpoint.

const SUPABASE_URL  = 'https://chfkssclmdshdcijfzdr.supabase.co';
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE';
// ☝️  Supabase anon key is intentionally public — it is safe here.
// RLS (Row Level Security) on Supabase tables is what protects the data,
// not hiding this key. See: https://supabase.com/docs/guides/database/row-level-security

// ── YOUR CLOUDFLARE WORKER URL ────────────────────────────
// After deploying cloudflare-worker.js, replace this URL:
const PROXY_URL = 'https://gulfhabibi-proxy.YOUR-NAME.workers.dev';
// On localhost, the worker can be run with: npx wrangler dev cloudflare-worker.js
// Then PROXY_URL = 'http://localhost:8787'

// ── AI MODELS (no keys — worker handles them) ─────────────
const GROQ_MODEL   = 'llama-3.3-70b-versatile';
const GEMINI_MODEL = 'gemini-2.0-flash';

// ── CATEGORIES ────────────────────────────────────────────
const CATEGORIES = {
  marketplace: [
    { id: 'electronics', label: 'Electronics' },
    { id: 'vehicles',    label: 'Vehicles' },
    { id: 'property',    label: 'Property' },
    { id: 'furniture',   label: 'Furniture' },
    { id: 'fashion',     label: 'Fashion' },
    { id: 'services',    label: 'Services' },
    { id: 'food',        label: 'Food' },
    { id: 'education',   label: 'Education' },
    { id: 'fitness',     label: 'Fitness' },
    { id: 'pets',        label: 'Pets' },
    { id: 'plants',      label: 'Plants' },
    { id: 'tools',       label: 'Tools' },
    { id: 'other',       label: 'Other' }
  ],
  directory: [
    { id: 'interior',      label: 'Interior Design' },
    { id: 'construction',  label: 'Construction' },
    { id: 'medical',       label: 'Medical & Health' },
    { id: 'legal',         label: 'Legal Services' },
    { id: 'food',          label: 'Food & Restaurant' },
    { id: 'beauty',        label: 'Beauty & Salon' },
    { id: 'education',     label: 'Education' },
    { id: 'it',            label: 'IT & Technology' },
    { id: 'realestate',    label: 'Real Estate' },
    { id: 'cleaning',      label: 'Cleaning' },
    { id: 'transport',     label: 'Transport' },
    { id: 'finance',       label: 'Finance' },
    { id: 'retail',        label: 'Retail & Shopping' },
    { id: 'other',         label: 'Other' }
  ]
};

const EMIRATES = ['Dubai','Abu Dhabi','Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'];
