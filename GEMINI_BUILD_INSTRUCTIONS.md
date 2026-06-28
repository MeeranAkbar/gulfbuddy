# 🏗️ GULFBUDDY PLATFORM — COMPLETE BUILD INSTRUCTIONS FOR AI AGENT

> **THIS FILE IS FOR**: Google Gemini Pro 3.1 (or any AI coding agent)
> **PROJECT**: GulfBuddy — All-in-One UAE Marketplace Platform
> **DOMAIN**: gulfbuddy.com
> **LOCATION**: `D:\Project Try\GulfBuddy Platform`
> **GOAL**: Build a production-ready, secure, premium-looking marketplace platform and run it locally

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Architecture Decision](#2-architecture-decision)
3. [Design System Reference](#3-design-system-reference)
4. [Phase 1: Project Setup & Run Locally](#phase-1-project-setup--run-locally)
5. [Phase 2: Rebrand to GulfBuddy](#phase-2-rebrand-to-gulfbuddy)
6. [Phase 3: Design System & Global Styles](#phase-3-design-system--global-styles)
7. [Phase 4: Homepage Build](#phase-4-homepage-build)
8. [Phase 5: Section Pages](#phase-5-section-pages)
9. [Phase 6: Security Hardening](#phase-6-security-hardening)
10. [Phase 7: Admin Panel & Dashboard](#phase-7-admin-panel--dashboard)
11. [Phase 8: Testing & Verification](#phase-8-testing--verification)
12. [File Reference Map](#file-reference-map)
13. [Database Schema Reference](#database-schema-reference)
14. [Rules & Constraints](#rules--constraints)

---

## 1. PROJECT OVERVIEW

**GulfBuddy** is a UAE-focused multi-vertical classifieds and marketplace platform. Think Dubizzle + Bayut + ServiceMarket combined into one trusted, free-to-use platform.

### Target Audience
- UAE residents (expats and locals) across all 7 emirates
- Job seekers, property hunters, car buyers, service seekers, business owners

### 6 Core Sections
| Section | Purpose | Accent Color |
|---------|---------|-------------|
| **Property** | Buy/Sell/Rent real estate | `#2563eb` (blue) |
| **Motors** | Buy/sell vehicles | `#d97706` (amber) |
| **Jobs** | Find/post jobs | `#15803d` (green) |
| **Classifieds** | General buy/sell marketplace | `#7c3aed` (purple) |
| **Services** | Home/business services with deals | `#ea580c` (orange) |
| **Directory** | Business listings | `#C9A84C` (gold) |

### Revenue Model (implement later)
- Featured listings: AED 99/mo
- Premium listings: AED 299/mo
- Google AdSense ads
- Services commission (5-10%)

---

## 2. ARCHITECTURE DECISION

### WE ARE BUILDING ON: **Next.js Platform** (NOT the legacy HTML site)

The project has an existing Next.js 15 monorepo at:
```
D:\Project Try\GulfBuddy Platform\
├── apps/
│   ├── web/          ← Next.js 15 app (THIS IS WHAT WE BUILD)
│   └── worker/       ← Cloudflare Worker (API proxy)
├── packages/
│   ├── analytics/
│   ├── config/
│   ├── seo/
│   ├── types/
│   ├── ui/
│   └── validation/
├── supabase/
│   └── migrations/   ← 19 migration files (schema ready)
├── package.json      ← Root monorepo config
├── turbo.json        ← Turborepo config
└── tsconfig.base.json
```

### Key Tech Stack
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.2 | Framework (App Router) |
| React | 19.0 | UI library |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Turborepo | 2.5 | Monorepo build |
| Supabase | Latest | Database + Auth |
| Zod | 3.24 | Validation |
| React Hook Form | 7.55 | Form handling |
| npm | 11.9 | Package manager |

### Important File Locations
```
apps/web/
├── app/
│   ├── layout.tsx           ← Root layout
│   ├── globals.css          ← Design system CSS (345 lines)
│   ├── not-found.tsx
│   ├── global-error.tsx
│   ├── (public)/            ← Public pages (homepage, sections)
│   │   ├── layout.tsx       ← Wraps in AppShell
│   │   ├── page.tsx         ← HOMEPAGE
│   │   ├── property/
│   │   ├── motors/
│   │   ├── jobs/
│   │   ├── classifieds/
│   │   ├── services/
│   │   ├── directory/
│   │   ├── pricing/
│   │   ├── about/
│   │   ├── search/
│   │   ├── blog/
│   │   ├── help/
│   │   └── contact/
│   ├── (auth)/              ← Auth pages (login, register)
│   ├── (workspace)/         ← Protected user dashboard
│   └── (admin)/             ← Admin panel
├── components/
│   ├── app-shell.tsx        ← Header + navigation wrapper
│   ├── section-page.tsx     ← Reusable section hero template
│   ├── theme-toggle.tsx
│   ├── search/              ← GlobalSearch, HomepageHeroSearch
│   ├── property/
│   ├── motors/
│   ├── jobs/
│   ├── classifieds/
│   ├── services/
│   ├── directory/
│   ├── forms/
│   ├── auth/
│   ├── company/
│   ├── workspace/
│   └── operators/
├── lib/
│   ├── supabase/
│   │   ├── client.ts        ← Browser Supabase client
│   │   ├── server.ts        ← Server Supabase client
│   │   ├── middleware.ts    ← Session management
│   │   └── admin.ts         ← Service role client
│   ├── env.ts               ← Zod-validated env config
│   └── route-map.ts         ← All route definitions
├── middleware.ts             ← Auth middleware
├── .env.local               ← Environment variables (EXISTS)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 3. DESIGN SYSTEM REFERENCE

### Brand Identity
- **Name**: GulfBuddy (NOT GulfHabibi — this was a previous name)
- **Domain**: gulfbuddy.com
- **Tagline**: "Find Anything in the UAE — All in One Place"
- **Font**: `Plus Jakarta Sans` (Google Fonts, weights 300-800)

### Color Palette

#### Core Colors
```css
/* Brand */
--gold:        #c9a84c;     /* Primary brand gold */
--gold-light:  #e8c46a;     /* Gold hover state */
--gold-dim:    rgba(201,168,76,0.1);  /* Gold tint bg */
--gold-border: rgba(201,168,76,0.3);  /* Gold border */

/* Navigation — ALWAYS dark */
--nav-bg:      #1a1a1a;
--nav-border:  #2a2a2a;
--nav-text:    #aaa;
--nav-hover:   #fff;
--nav-active:  #c9a84c;

/* Light Mode (default) */
--bg:          #ffffff;      /* Page background */
--bg2:         #f7f7f7;      /* Secondary background */
--bg3:         #f0f0f0;      /* Tertiary */
--bg4:         #e8e8e8;      /* Quaternary */
--border:      #e5e5e5;
--border2:     #d0d0d0;
--text:        #111111;      /* Primary text */
--text-dim:    #555555;      /* Secondary text */
--text-muted:  #999999;      /* Muted text */

/* Semantic */
--green:       #16a34a;      /* Success */
--red:         #dc2626;      /* Error/danger */
--blue:        #2563eb;      /* Info/links */
```

#### Section Accent Colors (used for section cards, badges, borders)
```css
--motors-accent:      #d97706;  /* Amber */
--property-accent:    #2563eb;  /* Blue */
--jobs-accent:        #15803d;  /* Green */
--classifieds-accent: #7c3aed;  /* Purple */
--services-accent:    #ea580c;  /* Orange */
--directory-accent:   #C9A84C;  /* Gold */
```

#### Dark Mode
```css
[data-theme="dark"] {
  --bg:          #0f172a;     /* Deep navy */
  --bg2:         #1e293b;
  --bg3:         #334155;
  --text:        #f1f5f9;
  --text-dim:    #94a3b8;
  --text-muted:  #64748b;
  --border:      #334155;
}
```

### Layout Tokens
```css
--radius:      8px;
--radius-md:   10px;
--radius-lg:   14px;
--shadow-sm:   0 1px 3px rgba(0,0,0,0.08);
--shadow-md:   0 4px 12px rgba(0,0,0,0.08);
```

### Tailwind Config (already exists at `apps/web/tailwind.config.ts`)
```ts
colors: {
  ink:    '#0f172a',
  sand:   '#f8f5ee',
  gold:   '#d4a937',   // Note: slightly different from CSS var
  bronze: '#855b2f'
},
boxShadow: { lift: '0 24px 60px rgba(15, 23, 42, 0.08)' },
borderRadius: { shell: '28px' }
```

### Typography
- H1: `text-4xl font-bold` (36-40px)
- H2: `text-2xl font-semibold` (24-28px)
- H3: `text-xl font-semibold` (20px)
- Body: `text-base` (16px)
- Small: `text-sm` (14px)
- Muted: `text-xs text-gray-500` (12px)

### Component Classes (from `globals.css`)
- `.gh-shell` — Max-width shell container
- `.gh-container` — Content container
- `.gh-card` — Card component (rounded, shadow, border)
- `.gh-hero` — Hero section
- `.gh-pill` — Small badge/pill
- `.gh-button-primary` — Gold primary button
- `.gh-button-secondary` — Outlined button
- `.gh-button-ghost` — Ghost/text button
- `.gh-field` — Form input field
- `.gh-toggle-*` — Toggle switch

---

## PHASE 1: PROJECT SETUP & RUN LOCALLY

### Task 1.1: Install Dependencies
```bash
cd "D:\Project Try\GulfBuddy Platform"
npm install
```

**Expected**: All workspaces install successfully. If there are peer dependency issues, use `npm install --legacy-peer-deps`.

### Task 1.2: Verify Environment
Check that `apps/web/.env.local` exists and has these values:
```env
NODE_ENV=development
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_DOMAIN=localhost
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPABASE_URL=https://chfkssclmdshdcijfzdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<the existing key>
SUPABASE_SERVICE_ROLE_KEY=<the existing key>
```

DO NOT change or remove any existing keys. They connect to the live Supabase database.

### Task 1.3: Run Dev Server
```bash
cd "D:\Project Try\GulfBuddy Platform"
npm run dev
```

This runs `turbo run dev --parallel` which starts the Next.js dev server.
Open `http://localhost:3000` in browser.

### Task 1.4: Fix Any Build Errors
If there are build errors:
1. Check for missing TypeScript types
2. Check for missing component imports
3. Check for Tailwind configuration issues
4. Fix each error one at a time
5. **DO NOT delete existing code** — only fix errors

**ACCEPTANCE**: `http://localhost:3000` loads the homepage without errors.

---

## PHASE 2: REBRAND TO GULFBUDDY

The codebase currently uses "GulfHabibi" branding. We need to change ALL instances to "GulfBuddy".

### Task 2.1: Update Root Layout Metadata
**File**: `apps/web/app/layout.tsx`
- Change `metadataBase` from `https://gulfhabibi.com` → `https://gulfbuddy.com`
- Change title default from `GulfHabibi` → `GulfBuddy`
- Change description to mention GulfBuddy

### Task 2.2: Update App Shell Branding
**File**: `apps/web/components/app-shell.tsx`
- Change logo text from "GulfHabibi" to "GulfBuddy"
- Logo format: "Gulf" in white + "Buddy" in gold (#c9a84c)
- Keep the existing gold square icon (28×28px)

### Task 2.3: Search & Replace All References
Do a project-wide search in `apps/web/` for:
- `GulfHabibi` → `GulfBuddy` (case-sensitive)
- `gulfhabibi` → `gulfbuddy` (case-sensitive, for URLs/slugs)
- `Gulf Habibi` → `Gulf Buddy` (if any)
- `GULFHABIBI` → `GULFBUDDY` (if any)

**DO NOT change**:
- The Supabase URL (it contains different text)
- The Cloudflare Worker URL
- File names of migration files
- Git history

### Task 2.4: Update SEO Package
**File**: `packages/seo/src/` — update any hardcoded domain or brand name references.

### Task 2.5: Update Config Package
**File**: `packages/config/src/` — update any brand name references.

**ACCEPTANCE**: All visible text shows "GulfBuddy". No "GulfHabibi" appears in UI. Domain references point to gulfbuddy.com.

---

## PHASE 3: DESIGN SYSTEM & GLOBAL STYLES

### Task 3.1: Update `globals.css`
**File**: `apps/web/app/globals.css`

Ensure the design system has ALL of these CSS custom properties defined. The file already has 345 lines — enhance it, don't replace it:

```css
:root {
  /* Add these if missing */
  --gold: #c9a84c;
  --gold-light: #e8c46a;
  --gold-dim: rgba(201,168,76,0.1);
  --gold-border: rgba(201,168,76,0.3);

  --motors-accent: #d97706;
  --property-accent: #2563eb;
  --jobs-accent: #15803d;
  --classifieds-accent: #7c3aed;
  --services-accent: #ea580c;
  --directory-accent: #C9A84C;

  --nav-bg: #1a1a1a;
  --nav-border: #2a2a2a;
  --nav-text: #aaa;
  --nav-hover: #fff;
  --nav-active: #c9a84c;

  --green: #16a34a;
  --red: #dc2626;
  --blue: #2563eb;
}
```

### Task 3.2: Ensure Dark Mode Works
The existing `globals.css` has dark mode via `[data-theme="dark"]`. Verify it covers:
- Page backgrounds
- Card backgrounds
- Text colors
- Border colors
- Input field backgrounds
- Navbar remains dark in both modes

### Task 3.3: Responsive Breakpoints
Ensure all components work at these breakpoints:
- Desktop: 1280px+
- Tablet: 768px–1279px
- Mobile: below 768px

Key pattern: Use Tailwind responsive classes (`md:`, `lg:`, `xl:`) or CSS media queries.

**ACCEPTANCE**: All CSS variables render correctly. Dark mode toggle works. Pages look correct on mobile/tablet/desktop.

---

## PHASE 4: HOMEPAGE BUILD

The homepage is the most important page. It must look **premium and impressive**.

### Task 4.1: Study the Reference
The legacy homepage at `D:\Project Try\GulfBuddy Platform\home.html` shows the intended design:
1. **Hero section** with gradient background
2. **Search with 6 category tabs** (All, Motors, Property, Jobs, Classifieds, Services)
3. **Search input** with emirate dropdown and gold Search button
4. **Stats bar** (25+ Businesses, 7 Emirates, Free Always, 24/7 Support)
5. **6 section cards** in a grid with images and colored accent borders
6. **Trust signals** section

### Task 4.2: Build the Homepage
**File**: `apps/web/app/(public)/page.tsx`

The file already exists (215 lines). Enhance it to match the legacy design with modern React components:

#### Hero Section
```tsx
// Pattern to follow:
<section className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-4xl mx-auto text-center px-4">
    {/* Badge */}
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[var(--gold-dim)] text-[var(--gold)] border border-[var(--gold-border)] mb-6">
      🇦🇪 UAE's All-in-One Marketplace
    </span>

    {/* Heading */}
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
      Find Anything in the UAE
      <span className="block text-[var(--gold)]">All in One Place</span>
    </h1>

    {/* Subtitle */}
    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
      Property, Motors, Jobs, Services, Classifieds & Business Directory — 
      trusted by thousands across all 7 emirates.
    </p>

    {/* Search Component */}
    <HomepageHeroSearch />
  </div>
</section>
```

#### Search Component
**File**: `apps/web/components/search/homepage-hero-search.tsx`

Build or enhance to include:
- 6 category tabs (All, Motors, Property, Jobs, Classifieds, Services)
- Search text input with placeholder "Search across all categories..."
- Emirates dropdown (Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah)
- Gold "Search" button
- On submit: redirect to `/search?q={query}&category={category}&emirate={emirate}`

#### Section Cards Grid
After the hero, add 6 section cards:
// Add sections array here and map it to a grid

#### Stats Bar
// Add stats bar here

**ACCEPTANCE**: Homepage loads at `http://localhost:3000` with hero, search, section cards, and stats. Looks premium and professional. Mobile responsive.

---

## PHASE 5: SECTION PAGES

Each section needs: **Browse page**, **Listing detail page**, and **Post page**.

### Task 5.1: Property Section
**Directory**: `apps/web/app/(public)/property/`

Create these pages:
- `page.tsx` — Browse properties with filters (emirate, type, price range, beds, purpose: sale/rent)
- `[slug]/page.tsx` — Individual property listing detail

**Property Browse Page Features:**
- Hero banner with section title and description
- Filter bar
- Results grid showing property cards
- Pagination or "Load More"

**Data Fetching Pattern:**
Use Supabase Client from `@/lib/supabase/server`. If Supabase tables don't have data yet or the query fails, show **mock/demo data** so the UI still renders.

### PATTERN FOR ALL SECTION PAGES
Every section browse page should follow this layout:
```
┌─────────────────────────────────────────┐
│  Section Hero (colored gradient bg)     │
│  Title + Description + Quick Stats      │
├─────────────────────────────────────────┤
│  Filter Bar (horizontal, collapsible)   │
├─────────────────────────────────────────┤
│  Results Count + Sort Dropdown          │
├─────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ Card │ │ Card │ │ Card │            │
│  └──────┘ └──────┘ └──────┘            │
│  ┌──────┐ ┌──────┐ ┌──────┐            │
│  │ Card │ │ Card │ │ Card │            │
│  └──────┘ └──────┘ └──────┘            │
├─────────────────────────────────────────┤
│  Load More / Pagination                 │
└─────────────────────────────────────────┘
```

**ACCEPTANCE**: Each section page loads, shows its hero, filters, and cards (real or mock). Dark mode works. Mobile responsive. Navigation between sections works.

---

## PHASE 6: SECURITY HARDENING

### Task 6.1: Middleware Auth Protection
**File**: `apps/web/middleware.ts`
Ensure protected routes redirect to login if unauthenticated.

### Task 6.2: Input Sanitization
Create a utility at `apps/web/lib/sanitize.ts` to sanitize user inputs and prevent XSS.

### Task 6.3: Rate Limiting Headers
**File**: `apps/web/next.config.mjs`
Add security headers.

**ACCEPTANCE**: Protected routes redirect to login. All user inputs are sanitized. Security headers appear in browser DevTools → Network → Response Headers.

---

## PHASE 7: ADMIN PANEL & DASHBOARD

### Task 7.1: Admin Dashboard
**Directory**: `apps/web/app/(admin)/admin/`
Create a basic admin dashboard.

### Task 7.2: User Dashboard
**Directory**: `apps/web/app/(workspace)/dashboard/`
Create a user dashboard.

### Task 7.3: Authentication Pages
**Directory**: `apps/web/app/(auth)/`
Ensure login and registration work with Supabase.

**ACCEPTANCE**: Admin panel loads for admin users. Dashboard loads for logged-in users. Auth pages work with Supabase.

---

## PHASE 8: TESTING & VERIFICATION

### Task 8.1: Visual Check — All Pages
Navigate to each route and verify.

### Task 8.2: Responsive Check
Verify it looks correct at Desktop, Tablet, and Mobile.

### Task 8.3: Dark Mode Check
Verify dark mode works correctly.

### Task 8.4: Navigation Check
Verify all links work.

### Task 8.5: Security Check
Verify auth protection and input sanitization.

---

## FILE REFERENCE MAP
Check the previous planning for the complete file reference map and database schema reference.

---

## RULES & CONSTRAINTS

### DO's ✅
1. **DO** use TypeScript strict mode — no `any` types
2. **DO** use React Server Components by default
3. **DO** use Tailwind CSS classes for styling
4. **DO** use CSS custom properties from `globals.css` for brand colors
5. **DO** handle loading and error states
6. **DO** provide mock/fallback data when Supabase queries fail
7. **DO** preserve ALL existing code, comments, and configurations

### DON'Ts ❌
1. **DON'T** delete or rename existing files without reason
2. **DON'T** change the Supabase URL, keys, or migration files
3. **DON'T** install new npm packages unless absolutely necessary
4. **DON'T** hardcode API keys or secrets in code

---

> **END OF INSTRUCTIONS**
> Follow the phases in order. Test after each phase. Report any errors with the exact error message and file path.
