// ============================================================
// GULFHABIBI AI TRUST SYSTEM - shared/trust.js
// Layer 2 security - AI content scoring via secure proxy
// Layer 3 - duplicate detection
// Layer 4 - rate limiting (client-side)
// Requires: sanitise.js + config.js loaded first
// ============================================================

const GBRateLimit = {
  key: 'gb_post_times',
  maxPer10Min: 3,

  canPost() {
    const now = Date.now();
    const times = JSON.parse(localStorage.getItem(this.key) || '[]');
    const recent = times.filter(t => now - t < 10 * 60 * 1000);
    if (recent.length >= this.maxPer10Min) {
      const waitMin = Math.ceil((10 * 60 * 1000 - (now - recent[0])) / 60000);
      return { allowed: false, message: `You've posted ${this.maxPer10Min} listings recently. Please wait ${waitMin} minute(s).` };
    }
    return { allowed: true };
  },

  record() {
    const now = Date.now();
    const times = JSON.parse(localStorage.getItem(this.key) || '[]');
    times.push(now);
    localStorage.setItem(this.key, JSON.stringify(times.slice(-20)));
  },
};

const GBTrust = {

  async scoreContent(listing) {
    const proxyUrl = (typeof PROXY_URL !== 'undefined' && PROXY_URL) ? PROXY_URL : '';
    if (!proxyUrl || proxyUrl.includes('YOUR-NAME')) {
      console.warn('GBTrust: PROXY_URL not configured - skipping AI score');
      return { score: 75, action: 'approve', flags: [], reason: 'proxy not configured' };
    }
    try {
      const res = await fetch(`${proxyUrl}/api/trust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing })
      });
      if (!res.ok) throw new Error('Trust gateway error ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('GBTrust: AI scoring failed, using manual checks only', e);
      return { score: 75, action: 'approve', flags: [], reason: 'AI check unavailable' };
    }
  },

  async checkDuplicate(title, phone, supaUrl, supaKey) {
    if (!title || !phone) return { isDuplicate: false };
    try {
      const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
      const url = `${supaUrl}/rest/v1/listings?title=eq.${encodeURIComponent(title)}&contact_phone=eq.${encodeURIComponent(cleanPhone)}&status=eq.active&select=id,title&limit=1`;
      const res = await fetch(url, {
        headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` }
      });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return { isDuplicate: true, message: 'A listing with this title and phone already exists. Please check your active listings.' };
      }
      return { isDuplicate: false };
    } catch (e) {
      return { isDuplicate: false };
    }
  },

  async fullCheck(listing, config = {}) {
    const { supaUrl, supaKey, skipAI = false } = config;
    const results = { allowed: true, message: '', aiScore: null, flags: [] };

    const rateCheck = GBRateLimit.canPost();
    if (!rateCheck.allowed) {
      return { allowed: false, message: rateCheck.message, aiScore: null };
    }

    if (window.GBSanitise) {
      const spamCheck = GBSanitise.spamCheck((listing.title || '') + ' ' + (listing.description || ''));
      if (!spamCheck.clean) results.flags.push(...spamCheck.flags);
    }

    if (supaUrl && supaKey) {
      const dupCheck = await this.checkDuplicate(listing.title, listing.contact_phone, supaUrl, supaKey);
      if (dupCheck.isDuplicate) {
        return { allowed: false, message: dupCheck.message, aiScore: null };
      }
    }

    if (!skipAI) {
      const aiScore = await this.scoreContent(listing);
      results.aiScore = aiScore;

      if (aiScore.action === 'reject') {
        return {
          allowed: false,
          message: `Your listing was not approved: ${aiScore.reason || 'Content policy violation'}. ${aiScore.flags?.join('. ') || ''}`,
          aiScore,
        };
      }

      if (aiScore.action === 'hold') {
        results.message = 'Your listing has been submitted and is under review. It will appear once approved.';
        results.holdForReview = true;
      }
    }

    if (results.allowed) GBRateLimit.record();
    return results;
  },
};

window.GBTrust = GBTrust;
window.GBRateLimit = GBRateLimit;
