// ============================================================
// GULFBUDDY AUTO-SEO ENGINE — shared/seo.js
// Add <script src="../shared/seo.js"></script> to every page
// Call initSEO(config) at top of each page's script
// ============================================================

const SITE_NAME = 'GulfHabibi UAE';
const SITE_URL  = 'https://gulfhabibi.com';
const SITE_DESC = 'UAE free classifieds — buy, sell, find jobs, rent property, hire services. All 7 Emirates covered.';
const SITE_IMG  = SITE_URL + '/shared/og-image.jpg';
const SITE_TWITTER = '@GulfHabibiUAE';

// ── CORE FUNCTION ────────────────────────────────────────────
// Call on every page with page-specific config
function initSEO(cfg = {}) {
  const title    = cfg.title    ? `${cfg.title} | ${SITE_NAME}` : `${SITE_NAME} — UAE Free Classifieds`;
  const desc     = cfg.desc     || SITE_DESC;
  const url      = cfg.url      || SITE_URL;
  const img      = cfg.img      || SITE_IMG;
  const type     = cfg.type     || 'website';
  const keywords = cfg.keywords || 'UAE classifieds, Dubai buy sell, property UAE, jobs Dubai, motors UAE';
  const noindex  = cfg.noindex  || false;

  // Title
  document.title = title;

  // Core meta tags
  setMeta('description', desc);
  setMeta('keywords', keywords);
  setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow');
  setMeta('author', SITE_NAME);

  // Open Graph (Facebook, WhatsApp, LinkedIn)
  setOG('og:title',       title);
  setOG('og:description', desc);
  setOG('og:url',         url);
  setOG('og:image',       img);
  setOG('og:image:width', '1200');
  setOG('og:image:height','630');
  setOG('og:type',        type);
  setOG('og:site_name',   SITE_NAME);
  setOG('og:locale',      'en_AE');

  // Twitter Card
  setOG('twitter:card',        'summary_large_image');
  setOG('twitter:site',        SITE_TWITTER);
  setOG('twitter:title',       title);
  setOG('twitter:description', desc);
  setOG('twitter:image',       img);

  // Canonical URL
  setLink('canonical', url);

  // Geo tags (UAE specific)
  setMeta('geo.region',   'AE');
  setMeta('geo.country',  'UAE');
  setMeta('language',     'English');

  // JSON-LD structured data
  if (cfg.jsonld) {
    setJsonLD(cfg.jsonld);
  } else {
    setJsonLD(buildWebsiteSchema());
  }
}

// ── HELPER FUNCTIONS ────────────────────────────────────────
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setOG(prop, content) {
  let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop); document.head.appendChild(el); }
  el.setAttribute('content', content);
}
function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}
function setJsonLD(schema) {
  let el = document.getElementById('jsonld-schema');
  if (!el) { el = document.createElement('script'); el.id = 'jsonld-schema'; el.type = 'application/ld+json'; document.head.appendChild(el); }
  el.textContent = JSON.stringify(schema, null, 2);
}

// ── SCHEMA BUILDERS ─────────────────────────────────────────
function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE_URL,
    "description": SITE_DESC,
    "potentialAction": {
      "@type": "SearchAction",
      "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/marketplace/?q={search_term_string}` },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/shared/logo.png` },
      "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "areaServed": "AE", "availableLanguage": ["English", "Arabic"] }
    }
  };
}

function buildPropertySchema(p) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": p.title,
    "description": p.description || '',
    "url": `${SITE_URL}/property/listing-${p.id}`,
    "image": p.images?.[0] || SITE_IMG,
    "offers": {
      "@type": "Offer",
      "price": p.price || 0,
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": p.area || p.emirate || 'UAE',
      "addressRegion": p.emirate || 'UAE',
      "addressCountry": "AE"
    },
    "numberOfRooms": p.beds || null,
    "floorSize": p.size_sqft ? { "@type": "QuantitativeValue", "value": p.size_sqft, "unitCode": "FTK" } : null
  };
}

function buildVehicleSchema(v) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": v.title,
    "description": v.description || '',
    "url": `${SITE_URL}/motors/listing-${v.id}`,
    "image": v.images?.[0] || SITE_IMG,
    "brand": { "@type": "Brand", "name": v.vehicle_brand || '' },
    "model": v.vehicle_model || '',
    "vehicleModelDate": v.vehicle_year || '',
    "mileageFromOdometer": v.vehicle_km ? { "@type": "QuantitativeValue", "value": v.vehicle_km, "unitCode": "KMT" } : null,
    "offers": {
      "@type": "Offer",
      "price": v.price || 0,
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock",
      "itemCondition": v.vehicle_condition === 'New' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition"
    }
  };
}

function buildJobSchema(j) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": j.title,
    "description": j.description || '',
    "datePosted": j.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    "hiringOrganization": { "@type": "Organization", "name": j.company || SITE_NAME },
    "jobLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": j.emirate || 'UAE', "addressCountry": "AE" } },
    "baseSalary": j.salary_min ? { "@type": "MonetaryAmount", "currency": "AED", "value": { "@type": "QuantitativeValue", "minValue": j.salary_min, "maxValue": j.salary_max || j.salary_min, "unitText": "MONTH" } } : undefined,
    "employmentType": j.job_type === 'fulltime' ? 'FULL_TIME' : j.job_type === 'parttime' ? 'PART_TIME' : 'CONTRACTOR',
    "validThrough": new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
  };
}

function buildBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": SITE_URL + item.path
    }))
  };
}

// ── AUTO SEO FOR LISTING PAGES ───────────────────────────────
// Call after loading a listing from Supabase to set page-specific SEO

function setSEOForProperty(p) {
  const title = `${p.beds ? p.beds+'BR ' : ''}${capitalise(p.property_type||'Property')} ${p.purpose==='rent'?'For Rent':'For Sale'} in ${p.area||p.emirate||'UAE'}`;
  const desc  = `${title}${p.size_sqft?' | '+Number(p.size_sqft).toLocaleString()+' sqft':''}${p.furnishing?' | '+p.furnishing:''}${p.price?' | AED '+Number(p.price).toLocaleString()+'/yr':''}. Listed on GulfHabibi UAE.`;
  const url   = `${SITE_URL}/property/listing-${p.id}`;
  initSEO({ title, desc, url, img: p.images?.[0]||SITE_IMG, type:'product', keywords:`${p.property_type} ${p.purpose} ${p.area} ${p.emirate} UAE`, jsonld: buildPropertySchema(p) });
}

function setSEOForVehicle(v) {
  const title = `${v.vehicle_brand||''} ${v.vehicle_model||''} ${v.vehicle_year||''} For Sale in ${v.emirate||'UAE'}`.trim();
  const desc  = `${title}${v.vehicle_km?' | '+Number(v.vehicle_km).toLocaleString()+' km':''}${v.vehicle_condition?' | '+v.vehicle_condition:''} | AED ${v.price?Number(v.price).toLocaleString():'Contact'}. Listed on GulfHabibi UAE.`;
  const url   = `${SITE_URL}/motors/listing-${v.id}`;
  initSEO({ title, desc, url, img: v.images?.[0]||SITE_IMG, type:'product', keywords:`${v.vehicle_brand} ${v.vehicle_model} UAE car sale`, jsonld: buildVehicleSchema(v) });
}

function setSEOForJob(j) {
  const title = `${j.title} Job in ${j.emirate||'UAE'} — ${j.company||'Company'}`;
  const desc  = `Hiring ${j.title} in ${j.emirate||'UAE'}. ${j.job_type||'Full Time'}${j.salary_min?' | AED '+Number(j.salary_min).toLocaleString()+'/month':''}. Apply now on GulfHabibi.`;
  const url   = `${SITE_URL}/jobs/listing-${j.id}`;
  initSEO({ title, desc, url, img: SITE_IMG, type:'website', keywords:`${j.title} job ${j.emirate} UAE hire`, jsonld: buildJobSchema(j) });
}

// ── PAGE-LEVEL SEO CONFIGS ────────────────────────────────────
// Pre-built configs for each browse page — call at page load

const PAGE_SEO = {
  home: {
    title: 'GulfHabibi UAE — Free Classifieds, Jobs, Property & Motors',
    desc:  'Buy, sell, find jobs, rent property, list vehicles — all 7 UAE Emirates. Free forever. GulfHabibi is UAE\'s smarter alternative to Dubizzle.',
    url:   SITE_URL,
    keywords: 'UAE classifieds, Dubai buy sell, property Dubai rent, jobs UAE, motors Dubai, free listing UAE'
  },
  motors: {
    title: 'Cars & Vehicles For Sale in UAE — GulfHabibi Motors',
    desc:  'Browse thousands of cars, SUVs, trucks, bikes and boats for sale across UAE. Filter by brand, model, year, mileage and price. Free listings on GulfHabibi.',
    url:   SITE_URL + '/motors/',
    keywords: 'cars for sale UAE, Dubai cars, used cars UAE, motors UAE, SUV sale Dubai, Toyota Nissan BMW UAE'
  },
  property: {
    title: 'Property For Rent & Sale in UAE — GulfHabibi Property',
    desc:  'Find apartments, villas, townhouses and commercial properties for rent or sale across Dubai, Abu Dhabi, Sharjah and all UAE. RERA verified listings.',
    url:   SITE_URL + '/property/',
    keywords: 'property rent Dubai, apartments Dubai, villas UAE, property sale Abu Dhabi, RERA Dubai listings'
  },
  jobs: {
    title: 'Jobs in UAE — Find Work in Dubai, Abu Dhabi & Sharjah',
    desc:  'Thousands of job listings across 16 industries in UAE. Find full-time, part-time and freelance work. Free to apply. Post a job free on GulfHabibi.',
    url:   SITE_URL + '/jobs/',
    keywords: 'jobs UAE, jobs Dubai, jobs Abu Dhabi, hiring UAE, vacancies Dubai, work in UAE'
  },
  classifieds: {
    title: 'Buy & Sell in UAE — GulfHabibi Classifieds',
    desc:  'Electronics, furniture, fashion, baby items, sports gear and more. Buy and sell anything across UAE. Verified sellers. Free listings on GulfHabibi.',
    url:   SITE_URL + '/marketplace/',
    keywords: 'buy sell UAE, classifieds Dubai, electronics Dubai, furniture UAE, second hand Dubai'
  },
  services: {
    title: 'Home Services in UAE — AC, Plumbing, Cleaning & More',
    desc:  'Find trusted AC technicians, plumbers, cleaners, carpenters and more across UAE. Post a job request, get quotes, pick the best price. Free on GulfHabibi.',
    url:   SITE_URL + '/services/',
    keywords: 'AC repair Dubai, plumber UAE, home cleaning Dubai, handyman UAE, services Dubai'
  },
  directory: {
    title: 'UAE Business Directory — Find Trusted Businesses',
    desc:  'Find trusted businesses across all 7 UAE Emirates. Reviews, contact info, working hours and categories. Free business listing on GulfHabibi.',
    url:   SITE_URL + '/directory/',
    keywords: 'UAE business directory, Dubai companies, Sharjah businesses, Abu Dhabi directory'
  },
  pricing: {
    title: 'Pricing — GulfHabibi Featured & Premium Listings UAE',
    desc:  'Upgrade your listing on GulfHabibi. Featured listings from AED 99/month. Premium from AED 299/month. Off-Plan Pro from AED 599/month.',
    url:   SITE_URL + '/pricing.html',
    keywords: 'GulfHabibi pricing, featured listing UAE, premium property listing Dubai'
  }
};

// ── SHARE BUTTONS ────────────────────────────────────────────
// Inject share buttons on listing detail pages
function injectShareButtons(containerId, listing) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const pageUrl = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`Check this out on GulfHabibi: ${document.title}`);
  container.innerHTML = `
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin:12px 0">
      <a href="https://wa.me/?text=${text}%20${pageUrl}" target="_blank" rel="noopener"
         style="background:#25D366;color:#fff;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;text-decoration:none">📱 WhatsApp</a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener"
         style="background:#1877F2;color:#fff;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;text-decoration:none">📘 Facebook</a>
      <button onclick="navigator.clipboard.writeText(window.location.href).then(()=>alert('Link copied!'))"
         style="background:#1a1828;border:1px solid #C9A84C;color:#C9A84C;padding:7px 14px;border-radius:7px;font-size:12px;font-weight:700;cursor:pointer">🔗 Copy Link</button>
    </div>`;
}

function capitalise(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }
