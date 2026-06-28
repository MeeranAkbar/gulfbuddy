# GulfHabibi Platform — Project Log
Last Updated: 23 March 2026

---

## 🚀 HOW TO START A NEW CHAT
Say: "I'm Meeran. Read D:\Project Try\GulfBuddy Platform\PROJECT_LOG.md and continue building GulfHabibi"

---

## 🏢 Project Overview
- **Brand Name:** GulfHabibi (rebranded from GulfBuddy on 22 March 2026)
- **Domain:** gulfhabibi.com (registered and ready)
- **Preview URL:** natuaralcureguide.com (password: gulf2024)
- **Owner:** Ifash (Meeran), Dubai — runs Fast Jaguar (fit-out/renovation), moving to RAK
- **Business:** Ajman Freezone Licence + Ecommerce activity + UAE bank account ✅
- **Local Files:** D:\Project Try\GulfBuddy Platform\
- **AI Chat Files:** D:\Project Try\Gulf Buddy\

---

## 🌐 Hosting Status
- Hosting: Milesweb — natuaralcureguide.com (preview/test domain)
- FTP account: gulfhabibi@natuaralcureguide.com / GulfH@bibi2026
- Server path: /home/qukugdyc/natuaralcureguide.com/
- Preview URL: https://natuaralcureguide.com (password: gulf2024preview)
- **LIVE & VERIFIED: 23 March 2026** — all 46 files uploaded, GulfHabibi showing correctly
- gulfhabibi.com: Registered on Cloudflare — point DNS after testing on natuaralcureguide.com
- DNS plan: A record → Milesweb server IP, once testing is complete
| Item | Detail |
|---|---|
| Frontend | Pure HTML/CSS/JS — no framework |
| Database | Supabase (Sydney region) |
| Supabase URL | https://chfkssclmdshdcijfzdr.supabase.co |
| Supabase Anon Key | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE |
| Hosting | Milesweb cPanel — imperial.herosite.pro:2083 — user: qukugdyc |
| Server path | ~/natuaralcureguide.com/ |
| AI Engine | Groq API — llama-3.3-70b-versatile |
| Groq Key | <REMOVED_API_KEY> |
| Maps | Leaflet.js + OpenStreetMap (free) |
| Tools | Desktop Commander + Kapture Browser (Chrome control) |

---

## 📁 Full File Structure
```
D:\Project Try\GulfBuddy Platform\
├── home.html                    ← Homepage — white theme, search top, hero below
├── index.html                   ← Password gate (gulf2024)
├── about.html
├── pricing.html
├── privacy.html
├── terms.html
├── coming-soon.html
├── gb-admin-ctrl.html           ← Admin panel
├── PROJECT_LOG.md               ← THIS FILE
│
├── motors/
│   ├── index.html
│   ├── listing.html
│   └── post.html
│
├── property/
│   ├── index.html
│   ├── listing.html
│   └── post.html
│
├── jobs/
│   ├── index.html
│   ├── listing.html
│   └── post.html
│
├── marketplace/
│   ├── index.html
│   ├── listing.html
│   └── post.html
│
├── services/
│   ├── index.html               ← Flash/weekly/standard deals
│   ├── deals.html
│   ├── jobs.html
│   ├── post-deal.html
│   ├── post-job.html
│   └── post.html
│
├── directory/
│   ├── index.html               ← 25 businesses seeded
│   └── list.html
│
├── ai-guide/
│   ├── index.html
│   ├── app.js
│   └── lang.js
│
├── dashboard/index.html
├── partners/index.html
│
├── shared/
│   ├── style.css                ← MASTER CSS — white theme
│   ├── auth.js
│   ├── config.js
│   ├── seo.js
│   ├── theme.js
│   ├── trust.js
│   ├── search.js
│   ├── ai-router.js
│   └── gb-ref.js
│
├── SQL Files:
│   ├── FINAL_services_sql.sql   ← ⏳ NEEDS RUNNING in Supabase
│   ├── MASTER_SQL.sql           ← ⏳ NEEDS RUNNING in Supabase
│   ├── fix_rls_public.sql       ← ⏳ NEEDS RUNNING in Supabase
│   └── (others already run)
│
└── Python scripts (maintenance):
    ├── rebrand.py
    ├── replace_icons.py
    ├── apply_white_theme.py
    └── update_logo.py
```

---

## 🎨 Design System (APPROVED)
```
Theme:      White background + dark navbar (Dubizzle style)
Font:       Plus Jakarta Sans (800 headlines, 600 labels, 400 body)
Navbar:     Dark #1a1a1a, text-only links, gold logo
Body bg:    #ffffff
Surface:    #f7f7f7 / #f8f8f8
Border:     #e5e5e5
Text:       #111111 primary, #555 dim, #999 muted
Gold:       #c9a84c accent
Icons:      Lucide SVG 14px inline, 26px in section cards
Localhost:  http://localhost:8090 (python -m http.server 8090)
```

---

## ✅ Completed Features
- All 6 sections built: Motors, Property, Jobs, Classifieds, Services, Directory
- **AI Guide section REMOVED** (22 March 2026 — Meeran's decision)
- Homepage: dark navbar + white body + search bar + hero + section cards
- Full rebrand GulfBuddy → GulfHabibi (58 files)
- Domain registered: gulfhabibi.com
- Privacy Policy, Terms & Conditions pages
- Lucide SVG icon system — all emojis removed
- White theme applied across all 24+ pages
- Dark/Light theme toggle in navbar
- Mobile responsive with hamburger menu
- SEO meta tags on all pages
- User dashboard, Partners page
- 25 UAE businesses seeded in directory

## 🔒 Security Hardening Done (22-23 March 2026)
- All API keys removed from browser code
- Cloudflare Worker gateway built (cloudflare-worker.js)
- Worker: strict exact-origin allowlist, CORS fixed, preflight bug fixed
- Worker: rate limiting per IP via KV
- Worker: input sanitization + output PII filter + AI audit logging
- Admin panel: replaced hardcoded password with Supabase JWT auth
- Preview gate: replaced base64 password with one-way hash (gulf2024preview)
- .htaccess: HSTS, CSP, Permissions-Policy, SQL injection blocking
- .htaccess: blocks .sql .py .md .log files from public access

## 🐛 Bugs Fixed (23 March 2026)
- ADMIN_TOKEN never defined — ReferenceError fixed
- property/post.html orphaned error block — script crash fixed
- Worker CORS origin used before defined — preflight fixed
- Domain drift mygulfhabibi.com → gulfhabibi.com across 15 files
- Preview password hash mismatch — fixed
- auth.js ES module loading inconsistency — noted for future fix

## 🌐 Hosting Status
- Hosting: Milesweb — natuaralcureguide.com (preview/test domain)
- FTP account: gulfhabibi@natuaralcureguide.com / GulfH@bibi2026
- Server path: /home/qukugdyc/natuaralcureguide.com/
- Preview URL: https://natuaralcureguide.com (password: gulf2024preview)
- **LIVE & VERIFIED: 23 March 2026** — all 46 files uploaded, GulfHabibi showing correctly
- gulfhabibi.com: Registered on Cloudflare — point DNS after testing on natuaralcureguide.com

## 🗄️ Supabase Status (23 March 2026)
- MASTER_SQL.sql — ✅ RUN — all tables created
- FINAL_services_sql.sql — ✅ RUN — service deals + bookings created
- ai_audit_log.sql — ✅ RUN — audit log + site_settings created
- DO NOT run fix_rls_public.sql on production
- Homepage: dark navbar + white body + search bar + hero + section cards
- Full rebrand GulfBuddy → GulfHabibi (58 files)
- Domain registered: gulfhabibi.com
- Privacy Policy, Terms & Conditions pages
- Lucide SVG icon system — all emojis removed
- White theme applied across all 24+ pages
- Dark/Light theme toggle in navbar
- Mobile responsive with hamburger menu
- SEO meta tags on all pages
- User dashboard, Partners page
- 25 UAE businesses seeded in directory

## 🔒 Security Hardening Done (22 March 2026)
- All API keys removed from browser code
- Cloudflare Worker gateway built (cloudflare-worker.js)
- AI calls route through worker — keys never in browser
- Worker: strict exact-origin allowlist (no substring matching)
- Worker: CORS reflects exact request origin, not wildcard
- Worker: rate limiting per IP via KV
- Worker: input sanitization + output PII filter
- Worker: AI audit logging to Supabase
- Admin panel: replaced hardcoded password with Supabase JWT auth
- Preview gate: replaced base64 password with one-way hash
- .htaccess: HSTS, CSP, Permissions-Policy, SQL injection blocking
- .htaccess: blocks .sql .py .md .log files from public access
- Homepage: dark navbar + white body + search bar on top + hero below + section cards
- Section cards: 52px gold icon box, 26px Lucide SVG, coloured hover accent
- Global search bar with tabs: All / Motors / Property / Jobs / Classifieds / Services
- Stats bar: 25+ Businesses / 7 Emirates / Free / 24/7
- 25 UAE businesses seeded in directory (Premium/Featured/Free tiers)
- Emirates → Area → Neighbourhood filter in directory
- Services: flash deals, weekly deals, standard deals with countdown timers
- Service booking modal with payment held system
- Password gate on preview site (gulf2024)
- Full rebrand GulfBuddy → GulfHabibi (58 files)
- Domain registered: gulfhabibi.com
- Privacy Policy, Terms & Conditions pages ✅
- Lucide SVG icon system — 81 icons — ALL emojis removed sitewide
- White theme applied across all 24+ pages
- Dark/Light theme toggle button in navbar
- Mobile responsive with hamburger menu
- SEO meta tags on all pages
- User dashboard, Partners page

---

## ⏳ Pending — DO THESE NEXT

### 🔴 Priority 1 — Run SQL in Supabase
Open https://supabase.com/dashboard/project/chfkssclmdshdcijfzdr/sql
Run these files IN ORDER:
1. MASTER_SQL.sql
2. FINAL_services_sql.sql
3. fix_rls_public.sql

### 🔴 Priority 2 — Upload to gulfhabibi.com
- Point gulfhabibi.com DNS to Milesweb hosting
- Upload all files to server
- Update Supabase auth allowed URLs to gulfhabibi.com

### 🟡 Priority 3 — Consumer Protection Badge
- Apply at consumerrights.ae
- Have: Ajman Freezone licence ✅, Privacy Policy ✅, Terms ✅
- Adds massive trust — like Dubizzle yellow sticker

### 🟡 Priority 4 — Payment Gateway
- PayTabs (UAE-based, easy setup with Ajman licence)
- Needed for: Directory Featured/Premium payments, service bookings

### 🟡 Priority 5 — Logo Design
- No logo yet — using text "GulfHabibi" with gold SVG icon
- Design proper logo once platform finalised

### 🟢 Priority 6 — Future Features
- Google OAuth (enable in Supabase → Auth → Providers → Google)
- Services commission system (5-10% on completed jobs — Upwork model)
- Location-based ads (Emirates → Area → Industry)
- Detail pages: listing.html, job.html, business.html
- User subcategory creation (Phase 2)
- Mobile app (Phase 3)

---

## 💰 Revenue Model
| Stream | Status | Amount |
|---|---|---|
| Directory Featured | Ready to charge | AED 99/mo |
| Directory Premium | Ready to charge | AED 299/mo |
| Services commission | Build Phase 2 | 5-10% per job |
| Display ads (AdSense) | After go-live | Variable |
| Targeted ads (location) | Future | High value |

---

## 🌟 Competitive Advantages vs Dubizzle
1. AI Guide — 24/7 UAE law guidance (beats Dubizzle's basic blog)
2. Services commission model (Upwork for home services)
3. Hyper-local ads (Emirates → Area → Neighbourhood)
4. Arabic + English
5. Licensed UAE business (Ajman Freezone) ✅
6. Bank account ready ✅
7. All free for users — forever

---

## 📊 Platform Status
- Development: ~80% complete
- Estimated sessions to launch: 2-3 more
- Localhost: http://localhost:8090/home.html
- Start server: cd "D:\Project Try\GulfBuddy Platform" then python -m http.server 8090
