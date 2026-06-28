// ===== GULFBUDDY SMART SEARCH MODULE =====
// Handles search across all sections with analytics logging

const SUPA_URL = 'https://chfkssclmdshdcijfzdr.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE';

// ─── LOG EVERY SEARCH ───────────────────────────────────────────────
// Called after every search with the results count
// If results = 0, this becomes valuable "demand data" for you
async function logSearch(query, section, emirate, resultsCount) {
  if (!query || query.trim().length < 2) return;
  try {
    await fetch(`${SUPA_URL}/rest/v1/search_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        query: query.trim().toLowerCase(),
        section: section || 'all',
        emirate: emirate || null,
        results_count: resultsCount || 0
      })
    });
  } catch(e) {
    // Silent fail — never block UX for analytics
  }
}

// ─── SMART NO-RESULTS DISPLAY ───────────────────────────────────────
// Shows helpful message when search returns nothing
function renderNoResults(container, query, section, postUrl) {
  const sectionName = {
    motors: 'vehicle', property: 'property', jobs: 'job',
    classifieds: 'item', services: 'service', directory: 'business', all: 'listing'
  }[section] || 'listing';

  container.innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:60px 20px">
      <div style="font-size:48px;margin-bottom:16px">🔍</div>
      <div style="font-size:17px;font-weight:600;color:#ececec;margin-bottom:8px">
        No results for "${query}"
      </div>
      <div style="font-size:13px;color:#666;margin-bottom:24px;max-width:360px;margin-left:auto;margin-right:auto;line-height:1.6">
        We've noted your search. Be the first to post this ${sectionName} and reach people looking for it right now!
      </div>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        ${postUrl ? `<a href="${postUrl}" class="btn btn-gold" style="text-decoration:none">
          + Post this ${sectionName} Free
        </a>` : ''}
        <button onclick="clearSearch()" class="btn btn-outline">
          Clear Search
        </button>
      </div>
      <div style="margin-top:20px;font-size:12px;color:#444">
        💡 Try searching with fewer words or check spelling
      </div>
    </div>`;
}

// ─── SEARCH SUGGESTIONS (autocomplete from past searches) ───────────
// Fetches popular past searches to show as you type
async function getSearchSuggestions(query, section) {
  if (!query || query.length < 2) return [];
  try {
    const url = `${SUPA_URL}/rest/v1/search_log?query=ilike.${encodeURIComponent(query + '%')}&section=eq.${section}&order=searched_at.desc&limit=5&select=query,results_count`;
    const r = await fetch(url, {
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
    });
    const data = await r.json();
    if (!Array.isArray(data)) return [];
    // Return unique queries, prioritise ones that had results
    const seen = new Set();
    return data
      .filter(d => { if(seen.has(d.query)) return false; seen.add(d.query); return true; })
      .slice(0, 5)
      .map(d => ({ query: d.query, hasResults: d.results_count > 0 }));
  } catch(e) { return []; }
}

// ─── HOMEPAGE SEARCH ────────────────────────────────────────────────
// Powers the hero search bar on home.html
function doSearch() {
  const q = document.getElementById('heroSearch').value.trim();
  const em = document.getElementById('heroEmirate') ? document.getElementById('heroEmirate').value : '';
  const activeTab = window.activeSearchTab || 'all';

  const tabUrls = {
    all: 'marketplace/index.html',
    motors: 'motors/index.html',
    property: 'property/index.html',
    jobs: 'jobs/index.html',
    classifieds: 'marketplace/index.html',
    services: 'services/index.html'
  };

  const url = tabUrls[activeTab] || 'marketplace/index.html';
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (em) params.set('emirate', em);

  // Log the homepage search (results unknown at this point — logged per-page)
  if (q) logSearch(q, activeTab, em, null);

  window.location.href = url + (params.toString() ? '?' + params.toString() : '');
}

// ─── URL PARAM SEARCH ───────────────────────────────────────────────
// When user arrives on a page via search, pre-fill the search box
function applyUrlSearch(searchInputId) {
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  const em = params.get('emirate');
  if (q && document.getElementById(searchInputId)) {
    document.getElementById(searchInputId).value = q;
  }
  if (em) {
    const emSelect = document.getElementById('fEmirate') || document.getElementById('svcEmirate');
    if (emSelect) emSelect.value = em;
  }
  return { q, em };
}
