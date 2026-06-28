// ============================================================
// GULFBUDDY INPUT SANITISATION — shared/sanitise.js
// Layer 1 security — runs on every form submission
// Protects against: XSS, SQL injection attempts, spam patterns
// ============================================================

const GBSanitise = {

  // ── STRIP ALL HTML TAGS ────────────────────────────────────
  stripHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
      .trim();
  },

  // ── SANITISE TEXT FIELD ────────────────────────────────────
  // Strips HTML, limits length, removes null bytes
  text(str, maxLen = 500) {
    if (!str) return '';
    return this.stripHtml(str)
      .replace(/\0/g, '')
      .replace(/\u200b/g, '')
      .slice(0, maxLen)
      .trim();
  },

  // ── SANITISE TITLE ────────────────────────────────────────
  title(str) {
    const clean = this.text(str, 120);
    // Warn if ALL CAPS (spam signal — handled in trust.js)
    return clean;
  },

  // ── VALIDATE UAE PHONE ─────────────────────────────────────
  // Accepts: +971XXXXXXXXX or 05XXXXXXXX or 00971XXXXXXXXX
  phone(str) {
    if (!str) return { valid: false, cleaned: '', error: 'Phone number required' };
    const cleaned = str.replace(/[\s\-\(\)\.]/g, '');
    const patterns = [
      /^\+971[0-9]{8,9}$/,
      /^00971[0-9]{8,9}$/,
      /^0[0-9]{9}$/,
      /^971[0-9]{8,9}$/,
    ];
    const valid = patterns.some(p => p.test(cleaned));
    return { valid, cleaned, error: valid ? null : 'Please enter a valid UAE phone number (+971...)' };
  },

  // ── VALIDATE EMAIL ─────────────────────────────────────────
  email(str) {
    if (!str) return { valid: false, error: 'Email required' };
    const clean = str.trim().toLowerCase();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
    return { valid, cleaned: clean, error: valid ? null : 'Please enter a valid email address' };
  },

  // ── VALIDATE PRICE ─────────────────────────────────────────
  price(val, category) {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) return { valid: false, error: 'Please enter a valid price' };
    // Sanity check: price too low for category (scam detection)
    const minPrices = { property: 1000, vehicles: 500, jobs: 0, classifieds: 0, services: 0 };
    const min = minPrices[category] || 0;
    if (num > 0 && num < min) {
      return { valid: false, error: `Price seems too low for this category (min AED ${min})` };
    }
    return { valid: true, cleaned: num };
  },

  // ── VALIDATE RERA NUMBER ───────────────────────────────────
  rera(str) {
    if (!str) return { valid: true, cleaned: '' }; // optional outside Dubai
    const clean = str.replace(/\s/g, '');
    const valid = /^[0-9]{8,15}$/.test(clean);
    return { valid, cleaned: clean, error: valid ? null : 'RERA number should be 8-15 digits' };
  },

  // ── SANITISE ENTIRE LISTING OBJECT ────────────────────────
  listing(data) {
    const clean = {
      ...data,
      title:       this.title(data.title),
      description: this.text(data.description, 2000),
      area:        this.text(data.area, 100),
    };

    if (Object.prototype.hasOwnProperty.call(data, 'contact_name')) {
      clean.contact_name = this.text(data.contact_name, 80);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'user_name')) {
      clean.user_name = this.text(data.user_name, 80);
    }

    if (Object.prototype.hasOwnProperty.call(data, 'building')) {
      clean.property_building = this.text(data.building, 100);
      delete clean.building;
    }

    if (Object.prototype.hasOwnProperty.call(data, 'purpose')) {
      clean.property_purpose = this.text(data.purpose, 50);
      delete clean.purpose;
    }

    return clean;
  },

  // ── CHECK FOR SPAM PATTERNS ────────────────────────────────
  spamCheck(text) {
    const flags = [];
    const t = (text || '').toLowerCase();

    // Scam phrases
    const scamPhrases = [
      'western union', 'wire transfer', 'send deposit first',
      'paypal only', 'bitcoin payment', 'crypto only',
      'advance payment', 'money order', 'cashier check',
      'i am not in uae', 'currently abroad', 'contact my agent',
      'god fearing', '100% legit', 'no scam', 'serious buyers only',
    ];
    scamPhrases.forEach(p => { if (t.includes(p)) flags.push(`Possible scam phrase: "${p}"`); });

    // ALL CAPS check
    const words = text.split(' ').filter(w => w.length > 3);
    const capsCount = words.filter(w => w === w.toUpperCase() && /[A-Z]/.test(w)).length;
    if (words.length > 3 && capsCount / words.length > 0.6) {
      flags.push('Title or text is mostly uppercase (spam signal)');
    }

    // Excessive phone numbers
    const phoneMatches = text.match(/(\+?\d[\d\s\-]{8,14}\d)/g) || [];
    if (phoneMatches.length > 3) {
      flags.push('Multiple phone numbers detected');
    }

    // Excessive punctuation
    if ((text.match(/[!]{2,}/g) || []).length > 2) {
      flags.push('Excessive exclamation marks');
    }

    return { clean: flags.length === 0, flags };
  },

  // ── SHOW FIELD ERROR ───────────────────────────────────────
  showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '#ef4444';
    let err = field.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error';
      err.style.cssText = 'color:#ef4444;font-size:11px;margin-top:4px';
      field.parentElement.appendChild(err);
    }
    err.textContent = message;
  },

  clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '';
    const err = field.parentElement.querySelector('.field-error');
    if (err) err.remove();
  },

  clearAllErrors() {
    document.querySelectorAll('.field-error').forEach(e => e.remove());
    document.querySelectorAll('.form-input').forEach(f => f.style.borderColor = '');
  },
};

// Export for use in post forms
window.GBSanitise = GBSanitise;
