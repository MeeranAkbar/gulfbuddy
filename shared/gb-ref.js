// ============================================================
// GULFBUDDY REFERENCE + PERMIT SYSTEM — shared/gb-ref.js
// Handles: GulfHabibi ref number display + permit field per emirate
// Add to all post forms and listing pages
// ============================================================

// ── REFERENCE NUMBER FORMAT ───────────────────────────────────
// GB-PROP-DXB-001234  (server generated via Supabase trigger)
// Short form: GB-001234 (for phone/WhatsApp sharing)

const GBRef = {

  // Format a gb_ref for display
  format(ref) {
    if (!ref) return '—';
    return ref;
  },

  // Short version for sharing
  short(ref) {
    if (!ref) return '';
    const parts = ref.split('-');
    return 'GB-' + (parts[parts.length - 1] || ref);
  },

  // Copy ref to clipboard
  async copy(ref) {
    const text = ref || '';
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch(e) {
      const el = document.createElement('textarea');
      el.value = text; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    }
  },

  // Render a ref badge for listing cards/detail pages
  badge(ref, size = 'normal') {
    if (!ref) return '';
    const small = size === 'small';
    return `<span class="gb-ref-badge" style="
      display:inline-flex;align-items:center;gap:4px;
      background:rgba(201,168,76,0.08);
      border:1px solid rgba(201,168,76,0.2);
      border-radius:6px;
      padding:${small ? '2px 7px' : '3px 10px'};
      font-size:${small ? '10px' : '11px'};
      font-weight:700;color:#C9A84C;
      cursor:pointer;
      font-family:monospace;
      letter-spacing:0.5px;
    " onclick="GBRef.copy('${ref}').then(()=>{this.textContent='✅ Copied!';setTimeout(()=>{this.innerHTML='🔖 ${ref}'},1500)})"
    title="Click to copy reference number">🔖 ${ref}</span>`;
  },
};

// ── PERMIT CONFIG — ALL EMIRATES (property) ───────────────────
// "open" = show field, accept any value, never block submission
// "required" = show field, MUST be filled to submit
// "optional" = show field with guidance, not required

const GB_PERMIT_CONFIG = {
  'Dubai': {
    mode: 'required',
    label: 'Trakheesi Permit Number',
    placeholder: 'e.g. 7123456789',
    badge: '🏛️ Trakheesi Required',
    badgeColor: '#ef4444',
    help: 'Dubai property ads require a Trakheesi advertising permit. DLD Madmoun verification is tied to this permit flow and QR-based ad validation.',
    link: { text: 'Dubai Land Department Trakheesi system', url: 'https://dubailand.gov.ae/en/about-dubai-land-department/license-circulars/trakheesi-system/' },
    errorMsg: 'A valid Dubai Trakheesi permit number is required for property ads in Dubai.',
  },
  'Abu Dhabi': {
    mode: 'required',
    label: 'Dari / Madhmoun Website Permit',
    placeholder: 'Enter the Abu Dhabi website ad permit reference',
    badge: '🏛️ Dari / Madhmoun Required',
    badgeColor: '#ef4444',
    help: 'Abu Dhabi website property ads require a Dari / Madhmoun advertising permit reference before publication.',
    link: { text: 'Dari website advertising permit service', url: 'https://services.dari.ae/company-services/madhmoun-en/request-permit-to-advertise-on-websites-2/' },
    errorMsg: 'A Dari / Madhmoun website advertising permit is required for Abu Dhabi listings.',
  },
  'Sharjah': {
    mode: 'open',
    label: 'Property Reference / Permit Number',
    placeholder: 'Permit, reference, or any ID you have',
    badge: '📋 Reference (Optional)',
    badgeColor: '#888',
    help: 'Sharjah has no mandatory permit system yet. Enter any permit, title deed reference, or property ID you have. Leave blank if none.',
    link: null,
    errorMsg: null,
  },
  'Ajman': {
    mode: 'open',
    label: 'Property Reference / Permit Number',
    placeholder: 'Permit, reference, or any ID you have',
    badge: '📋 Reference (Optional)',
    badgeColor: '#888',
    help: 'Ajman has no mandatory listing permit currently. Enter any reference number, title deed ID, or municipality reference if available.',
    link: null,
    errorMsg: null,
  },
  'RAK': {
    mode: 'open',
    label: 'Property Reference / Permit Number',
    placeholder: 'Permit, reference, or any ID you have',
    badge: '📋 Reference (Optional)',
    badgeColor: '#888',
    help: 'RAK has no mandatory listing permit currently. You may enter any RAK municipality reference, title deed number, or project ID.',
    link: null,
    errorMsg: null,
  },
  'Fujairah': {
    mode: 'open',
    label: 'Property Reference / Permit Number',
    placeholder: 'Permit, reference, or any ID you have',
    badge: '📋 Reference (Optional)',
    badgeColor: '#888',
    help: 'Fujairah has no mandatory permit system. Enter any reference number or title deed ID if you have one.',
    link: null,
    errorMsg: null,
  },
  'UAQ': {
    mode: 'open',
    label: 'Property Reference / Permit Number',
    placeholder: 'Permit, reference, or any ID you have',
    badge: '📋 Reference (Optional)',
    badgeColor: '#888',
    help: 'UAQ has no mandatory permit system. Enter any reference or leave blank.',
    link: null,
    errorMsg: null,
  },
};

// ── PERMIT FIELD RENDERER ─────────────────────────────────────
const GBPermit = {

  // Call when emirate changes — updates permit field dynamically
  update(emirate, opts = {}) {
    const cfg = GB_PERMIT_CONFIG[emirate];
    const section = document.getElementById(opts.sectionId || 'permitSection');
    const label   = document.getElementById(opts.labelId   || 'permitLabel');
    const input   = document.getElementById(opts.inputId   || 'permitInput');
    const help    = document.getElementById(opts.helpId    || 'permitHelp');
    const banner  = document.getElementById(opts.bannerId  || 'permitBanner');

    if (!section) return;

    // Always show field for every emirate
    section.style.display = 'block';

    if (!cfg) {
      // Unknown emirate — show generic open field
      if (label) label.innerHTML = 'Property Reference / Permit Number <span style="color:#555;font-weight:400">(Optional)</span>';
      if (input) input.placeholder = 'Any permit, reference, or ID';
      if (help)  help.innerHTML = 'Enter any permit number, reference, or property ID if available.';
      if (banner) banner.style.display = 'none';
      return;
    }

    // Set label
    if (label) {
      const req = cfg.mode === 'required';
      label.innerHTML = cfg.label
        + (req ? ' <span style="color:#ef4444">*</span>'
                : ' <span style="color:#555;font-weight:400">(Optional)</span>');
    }

    // Set input
    if (input) {
      input.placeholder = cfg.placeholder;
      input.value = '';
    }

    // Set help text
    if (help) {
      let helpHtml = `<span style="color:#555;font-size:11px">${cfg.help}</span>`;
      if (cfg.link) {
        helpHtml += ` <a href="${cfg.link.url}" target="_blank"
          style="color:#C9A84C;font-size:11px">${cfg.link.text} ↗</a>`;
      }
      help.innerHTML = helpHtml;
    }

    // Update banner
    if (banner) {
      if (cfg.mode === 'required') {
        banner.style.display = 'block';
        banner.style.borderColor = 'rgba(239,68,68,0.3)';
        banner.style.background = 'rgba(239,68,68,0.06)';
        banner.innerHTML = `⚠️ <strong>${cfg.badge}:</strong> ${cfg.errorMsg}
          ${cfg.link ? `<a href="${cfg.link.url}" target="_blank" style="color:#C9A84C;margin-left:6px">${cfg.link.text} ↗</a>` : ''}`;
      } else {
        banner.style.display = 'block';
        banner.style.borderColor = 'rgba(201,168,76,0.15)';
        banner.style.background = 'rgba(201,168,76,0.04)';
        banner.innerHTML = `ℹ️ ${cfg.help}`;
      }
    }
  },

  // Validate permit field before submission
  validate(emirate, value) {
    const cfg = GB_PERMIT_CONFIG[emirate];
    if (!cfg) return { valid: true }; // unknown emirate — allow
    if (cfg.mode === 'required' && !value?.trim()) {
      return { valid: false, error: cfg.errorMsg };
    }
    return { valid: true };
  },
};

window.GBRef    = GBRef;
window.GBPermit = GBPermit;
window.GB_PERMIT_CONFIG = GB_PERMIT_CONFIG;
