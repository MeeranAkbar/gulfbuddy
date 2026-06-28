# GulfHabibi — Premium Design Brief for Codex
Version: 1.0
Date: 2026-03-31
Owner: Meeran (Ifash)
Purpose: Complete design direction for Codex to implement across the full Next.js platform

---

## 0. THE STANDARD WE ARE TARGETING

Study these references before writing a single line of UI code:
- **Airbnb** — card layouts, photography-first hero, clean typography hierarchy
- **Stripe** — dark hero with gradient depth, premium feature sections
- **Linear** — spacing discipline, motion, component consistency
- **Bayut.com** — UAE market context, property card density
- **Dubizzle** — classifieds layout patterns to BEAT and improve on

GulfHabibi must look like it cost AED 500,000 to build.
Every page must feel like a premium UAE marketplace — not a template.
Every component must feel intentional, not generic.

---

## 1. DESIGN PHILOSOPHY

### Core Rules
1. **White space is not empty space** — use it aggressively to create breathing room
2. **Every section must have a reason to exist** — no filler, no padding sections
3. **Cards must feel tactile** — subtle shadows, soft borders, hover lift
4. **Typography does the heavy lifting** — size contrast creates hierarchy, not colour
5. **Colour is rare and meaningful** — gold accent sparingly, not everywhere
6. **Mobile is NOT an afterthought** — design mobile-first, then expand to desktop
7. **Dark mode must be as premium as light mode** — not just inverted colours

### The GulfHabibi Feeling
When a user lands on GulfHabibi, they must feel:
- "This is a serious UAE platform"
- "This is cleaner than Dubizzle"
- "I trust this"
- "I know exactly where to go"

NOT:
- "This looks like a template"
- "Too much happening"
- "Where do I click?"

---

## 2. DESIGN TOKENS (USE THESE, DO NOT INVENT NEW ONES)

### Colours
```css
/* Already defined in globals.css — DO NOT redefine */
--background:          #f6f2e8          /* warm off-white, not pure white */
--background-elevated: #fcfaf4
--surface:             rgba(255,255,255,0.9)
--surface-alt:         rgba(248,244,236,0.92)
--text-primary:        #142033          /* near-black with warmth */
--text-secondary:      #425168
--text-muted:          #6b7688
--border-subtle:       rgba(20,32,51,0.08)
--border-default:      rgba(20,32,51,0.12)
--accent:              #d4a937          /* gold — USE SPARINGLY */
--accent-soft:         rgba(212,169,55,0.16)
--success:             #14805e
--danger:              #c03b3b
--shadow-sm: 0 12px 28px rgba(15,23,42,0.05)
--shadow-md: 0 20px 60px rgba(15,23,42,0.08)
--shadow-lg: 0 30px 90px rgba(15,23,42,0.12)
```

### Dark Mode Tokens
```css
--background:          #09111d
--background-elevated: #101a28
--surface:             rgba(13,22,36,0.88)
--accent:              #e0b64b
```

### Spacing Scale
Use multiples of 4px. The key sizes:
- `gap-2` = 8px — between inline items
- `gap-4` = 16px — between form fields
- `gap-6` = 24px — between card sections
- `gap-8` = 32px — between page sections
- `gap-12` = 48px — between major layout blocks

### Border Radius Scale
```
rounded-lg  = 8px   — small inputs, badges
rounded-xl  = 12px  — buttons, chips
rounded-2xl = 16px  — small cards
rounded-3xl = 24px  — main cards (gh-card)
rounded-[2rem] = 32px — hero sections
rounded-[2.25rem] = 36px — outer wrappers
```

### Typography Scale
Font: **Plus Jakarta Sans** (already loaded)
```
Hero H1:    text-5xl md:text-7xl   font-semibold  tracking-[-0.05em]
Section H2: text-3xl md:text-4xl   font-semibold  tracking-[-0.03em]
Card H3:    text-xl                font-semibold  tracking-tight
Label:      text-[0.68rem]         font-semibold  uppercase tracking-[0.22em]
Body:       text-base              font-normal    leading-8
Small:      text-sm                font-normal    leading-7
Micro:      text-xs                font-medium    tracking-[0.18em]
```

---

## 3. COMPONENT STANDARDS

### 3.1 Cards
Every card must use `.gh-card` as the base class.

**Standard Card:**
```tsx
<div className="gh-card p-6 md:p-8">
  {/* label */}
  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">
    Section label
  </p>
  {/* heading */}
  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
    Clear, direct heading
  </h2>
  {/* content */}
</div>
```

**Listing Card (Property/Motors/Jobs):**
```tsx
<Link href={href} className="group gh-card overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
  {/* Image area — always 16:9 or 3:2 ratio */}
  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-alt)]">
    <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
    {/* Badge overlay */}
    <div className="absolute left-3 top-3">
      <span className="rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
        {badge}
      </span>
    </div>
    {/* Price overlay — bottom right */}
    <div className="absolute bottom-3 right-3">
      <span className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-[0.68rem] font-semibold text-[var(--text-inverse)]">
        AED {price}
      </span>
    </div>
  </div>
  {/* Card body */}
  <div className="p-4 md:p-5">
    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-ink">{title}</h3>
    <p className="mt-2 text-sm text-[var(--text-secondary)]">{location}</p>
    <div className="mt-4 flex items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {/* Attribute chips */}
        {attrs.map(attr => (
          <span key={attr} className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-2.5 py-1 text-xs text-[var(--text-secondary)]">
            {attr}
          </span>
        ))}
      </div>
      <span className="text-sm font-semibold text-ink transition group-hover:translate-x-1">→</span>
    </div>
  </div>
</Link>
```

**Trust/Feature Card (Why GulfHabibi style):**
```tsx
<div className="rounded-[1.4rem] border border-[var(--border-subtle)] bg-[var(--surface-alt)] p-5">
  {/* Icon */}
  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
    <IconComponent className="h-5 w-5 text-[var(--accent)]" />
  </div>
  <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
</div>
```

### 3.2 Buttons
**Primary (dark background, light text):**
```tsx
<button className="gh-button-primary">Post listing</button>
```

**Secondary (outlined):**
```tsx
<button className="gh-button-secondary">Browse all</button>
```

**Gold CTA (special — use max once per page):**
```tsx
<button className="gh-button-primary !bg-[var(--accent)] !text-[var(--text-primary)] hover:!bg-[#c49b2a]">
  Get started free
</button>
```

**Ghost (minimal):**
```tsx
<button className="gh-button-ghost">Sign in</button>
```

**Destructive:**
```tsx
<button className="gh-button-primary !bg-[var(--danger)]">Delete listing</button>
```

### 3.3 Section Icons (REPLACE ALL LETTER PLACEHOLDERS)
Use Lucide React icons. Install if not present: `lucide-react`

Section mapping:
```tsx
import {
  Home,         // Property
  Car,          // Motors
  Briefcase,    // Jobs
  Wrench,       // Services
  BookOpen,     // Directory
  ShoppingBag,  // Classifieds
  Shield,       // Trust/Verified
  Star,         // Featured/Premium
  MapPin,       // Location
  Phone,        // Contact
  ChevronRight, // Navigation arrows
  Search,       // Search
  User,         // Profile
  Building2,    // Company/Agency
  Zap,          // Flash/Urgent
  CheckCircle,  // Verified/Approved
} from 'lucide-react';
```

**Section icon card:**
```tsx
<div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--accent-soft)]">
  <Home className="h-6 w-6 text-[var(--accent)]" />
</div>
```

Never use letter placeholders (`P`, `M`, `J`) — always use icons.

### 3.4 Badges / Pills
```tsx
{/* Category badge */}
<span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-alt)] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
  Property
</span>

{/* Verified badge — green */}
<span className="flex items-center gap-1.5 rounded-full bg-[var(--badge-verified)] px-3 py-1.5 text-[0.68rem] font-semibold text-[var(--success)]">
  <CheckCircle className="h-3.5 w-3.5" /> Verified
</span>

{/* Premium badge — gold */}
<span className="flex items-center gap-1.5 rounded-full bg-[var(--badge-premium)] px-3 py-1.5 text-[0.68rem] font-semibold text-[var(--accent)]">
  <Star className="h-3.5 w-3.5" /> Premium
</span>

{/* Featured badge — orange */}
<span className="flex items-center gap-1.5 rounded-full bg-[var(--badge-featured)] px-3 py-1.5 text-[0.68rem] font-semibold text-[var(--warning)]">
  Featured
</span>
```

### 3.5 Form Fields
```tsx
<div className="space-y-2">
  <label className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">
    Field label
  </label>
  <input
    className="gh-field"
    type="text"
    placeholder="Placeholder text"
  />
  {/* Error state */}
  <p className="text-xs text-[var(--danger)]">Error message here</p>
</div>
```

**Select field:**
```tsx
<select className="gh-field appearance-none cursor-pointer">
  <option>Option 1</option>
</select>
```

**Textarea:**
```tsx
<textarea className="gh-field min-h-[120px] resize-y" rows={4} />
```

### 3.6 Stats / KPI Strip
```tsx
<div className="gh-card grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-4">
  {[
    { value: '47,000+', label: 'Active listings' },
    { value: '7', label: 'Emirates covered' },
    { value: '12,000+', label: 'Verified operators' },
    { value: 'Free', label: 'To join and browse' },
  ].map((stat) => (
    <div key={stat.label} className="bg-[var(--surface)] p-6 text-center">
      <p className="text-3xl font-semibold tracking-tight text-ink">{stat.value}</p>
      <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">{stat.label}</p>
    </div>
  ))}
</div>
```

---

## 4. PAGE-BY-PAGE REQUIREMENTS

### 4.1 Homepage (`/`)

**Hero section — the most important surface on the platform:**
- Dark background: `bg-[#0d1730]`
- Full-width with slight rounded corners on desktop
- Real photography as background with `opacity-30` overlay
- One dominant headline: `Find anything in the UAE` + `all in one place.`
- Headline font: `text-5xl md:text-7xl font-semibold tracking-[-0.05em] text-white`
- One subline: `Property, motors, jobs, services and businesses across all seven emirates.`
- One search surface — the `GlobalSearch` component, NOT repeated in header
- Two CTAs: `Start searching` (primary) + `How it works` (ghost)
- NO floating text boxes saying "Trust-first" or "Premium operator profiles" — these are internal language

**Stats strip below hero:**
```
47,000+ listings  |  7 Emirates  |  12,000+ verified operators  |  Free to join
```

**Section tiles grid:**
- 6 tiles: Property, Motors, Jobs, Services, Directory, Classifieds
- Each tile: Lucide icon, section name, one-line description, hover arrow
- 2 columns mobile, 3 columns tablet, 6 columns desktop (or 3+3)
- Hover: lift `-translate-y-1`, border colour to `--accent`

**Featured listings strip:**
- 3 cards: one property, one motor, one job
- Real-looking titles — not internal placeholder text
- Real Unsplash images (photography, not abstract)
- "See all" link on the right of the heading

**"Why GulfHabibi" trust section:**
- 3–4 trust points with Lucide icons
- NOT marketing fluff — specific, concrete claims
- Example: "Every property listing is permit-checked before going public"

**Banner ad zone:**
- A clearly marked rectangular zone: `min-h-[90px]`
- Shows placeholder when no campaign active: light grey `bg-[var(--surface-alt)]` with `text-muted` text "Advertisement"
- Disappears cleanly (zero height) when disabled — use a feature flag

**Copy rules for homepage:**
- NEVER use: "Trust-first", "Launch-ready", "Premium operator profiles", "permit-backed visibility"
- DO use: "Find your next home", "Search 12,000+ listings", "Trusted by UAE residents"
- Every headline must be user-outcome-focused

---

### 4.2 Section Browse Pages (`/property`, `/motors`, `/jobs`, `/services`, `/classifieds`, `/directory`)

**Layout:**
```
[Hero strip with section name + search]
[Filter bar — horizontal scrollable chips]
[Content: 60% listing grid | 40% sidebar map OR full width grid]
[Pagination]
```

**Hero strip:**
- Smaller than homepage hero — `min-h-[280px]`
- Section-specific background colour (subtle, not loud)
- Section name + emirate selector + quick search
- Listing count: `"3,847 properties in Dubai"`

**Filter bar:**
- Horizontal scrollable chip row
- Active filter: `bg-[var(--primary)] text-[var(--text-inverse)]`
- Inactive: `border border-[var(--border-default)] bg-[var(--surface)]`
- Filters: Emirate, Category, Price range, Bedrooms (property), Brand (motors), etc.

**Listing grid:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns (or 2 + sidebar)
- Each card uses the Listing Card standard defined above

**Sidebar (desktop only):**
- Sticky position
- Map placeholder or filter panel
- Featured/sponsored listing slot

**Sort controls:**
- Right-aligned above grid: `Newest | Price: Low to High | Most relevant`

---

### 4.3 Listing Detail Pages (`/property/listing/[slug]`, `/motors/[slug]`)

**Layout:**
```
[Breadcrumb]
[Image gallery — 1 large + 4 thumbnails]
[Two column: 65% content | 35% sticky contact panel]
[Similar listings below]
```

**Image gallery:**
- First image full-width hero: `aspect-[16/9]`
- Below: 4 smaller thumbnails in a row
- Click to open lightbox (can be placeholder for now)
- Photo count badge: `"12 photos"`

**Content column:**
- Listing title: `text-2xl md:text-3xl font-semibold tracking-tight`
- Price: `text-3xl font-semibold text-ink` (never use colour for price)
- Location with `MapPin` icon
- Key attributes in a flex-wrap row of chips
- Full description with proper `leading-8` line height
- Verified badges if applicable

**Contact panel (sticky):**
```tsx
<div className="gh-card sticky top-24 space-y-4 p-6">
  {/* Agent/seller info */}
  <div className="flex items-center gap-3">
    <img className="h-12 w-12 rounded-2xl object-cover" src={agentAvatar} />
    <div>
      <p className="font-semibold text-ink">{agentName}</p>
      <p className="text-xs text-muted">{agencyName}</p>
    </div>
  </div>
  {/* CTAs */}
  <button className="gh-button-primary w-full">Call now</button>
  <button className="gh-button-secondary w-full">WhatsApp</button>
  <button className="gh-button-ghost w-full">Send enquiry</button>
  {/* Trust signals */}
  <div className="border-t border-[var(--border-subtle)] pt-4">
    <p className="text-xs text-muted">Listing ID: GH-29441</p>
    <p className="text-xs text-muted">Posted: 3 days ago</p>
  </div>
</div>
```

---

### 4.4 Navigation / App Shell

**Header structure:**
```
[Logo] [Nav links — hidden on mobile] [Theme toggle] [Sign in] [Post listing CTA]
```

**Logo:**
- NOT just a letter "G" in a box
- GulfHabibi wordmark: `Gulf` in `--text-primary` + `Habibi` in `--accent`
- Brand mark: small square with rounded corners, gold background, white "GH" in Plus Jakarta Sans
- Subline: `UAE Marketplace` in micro caps

**Nav links on mobile:**
- Hamburger menu → slide-in drawer from right
- Drawer shows full nav + sign in + post listing CTA

**"Post listing" button:**
- Always visible in header — this is the primary monetization CTA
- Style: `gh-button-primary` — dark background, light text
- Text: `+ Post listing` (with plus sign)
- On mobile: icon only (plus sign) to save space

**Header search (compact mode):**
- Shows on section browse pages, NOT on homepage (homepage has its own hero search)
- Single-line compact version of GlobalSearch
- Keyword input + location input + Search button

---

### 4.5 Admin Panel (`/admin`)

**Layout:**
- Left sidebar: 240px fixed, dark `bg-[#0d1422]`
- Content area: white/surface right side
- No top navigation — sidebar handles all navigation

**Sidebar:**
```
[GulfHabibi logo]
[Admin label]
[Navigation sections:]
  Dashboard
  --- Operations ---
  Listings
  Compliance
  Companies
  --- Monetization ---
  Packages
  Campaigns
  --- Risk ---
  Risk & Security
  --- System ---
  Settings
[Bottom: User avatar + name + sign out]
```

**Sidebar nav item:**
```tsx
<Link
  href={href}
  className={cn(
    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
    isActive
      ? "bg-white/12 text-white"
      : "text-white/52 hover:bg-white/6 hover:text-white/80"
  )}
>
  <Icon className="h-4 w-4 flex-shrink-0" />
  {label}
  {count ? (
    <span className="ml-auto rounded-full bg-[var(--danger)] px-2 py-0.5 text-[0.6rem] font-bold text-white">
      {count}
    </span>
  ) : null}
</Link>
```

**Admin cards / KPI boxes:**
```tsx
<div className="gh-card p-6">
  <div className="flex items-start justify-between gap-4">
    <div>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{change} vs last week</p>
    </div>
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
      <Icon className="h-5 w-5 text-[var(--accent)]" />
    </div>
  </div>
</div>
```

**Data tables:**
```tsx
<div className="gh-card overflow-hidden">
  <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] px-6 py-4">
    <h3 className="font-semibold text-ink">{title}</h3>
    <div className="flex items-center gap-3">
      {/* Filters + export */}
    </div>
  </div>
  <table className="w-full">
    <thead>
      <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-alt)]">
        <th className="px-6 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-[var(--border-subtle)]">
      <tr className="hover:bg-[var(--surface-alt)] transition">
        <td className="px-6 py-4 text-sm text-ink">Value</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### 4.6 Workspace / Dashboard (`/dashboard`)

**Layout:**
- Same left sidebar concept as admin but lighter background
- Content: full width, card-based layout

**Dashboard summary row:**
```
[Active listings: 4] [New leads: 12] [Profile views: 847] [Package: Starter]
```

**Quick actions:**
```tsx
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  {[
    { icon: Plus, label: 'New listing', href: '/listings/property/new' },
    { icon: Users, label: 'View leads', href: '/leads' },
    { icon: BarChart2, label: 'Analytics', href: '/dashboard' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ].map((action) => (
    <Link key={action.href} href={action.href}
      className="gh-card flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-0.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)]">
        <action.icon className="h-5 w-5 text-[var(--accent)]" />
      </div>
      <p className="text-sm font-semibold text-ink">{action.label}</p>
    </Link>
  ))}
</div>
```

---

### 4.7 Auth Pages (`/login`, `/register`)

**Layout:**
- Split screen on desktop: left = form (40%), right = brand visual (60%)
- Full screen on mobile: form only

**Left (form side):**
```tsx
<div className="flex min-h-screen flex-col justify-center px-8 py-12 lg:px-12">
  {/* Logo */}
  <Link href="/" className="flex items-center gap-3">
    <span className="gh-brand-mark ...">GH</span>
    <span className="font-semibold text-ink">GulfHabibi</span>
  </Link>

  <div className="mt-12 max-w-sm">
    <h1 className="text-3xl font-semibold tracking-tight text-ink">Sign in</h1>
    <p className="mt-3 text-sm text-[var(--text-secondary)]">
      Don't have an account? <Link href="/register" className="font-semibold text-ink underline">Create one free</Link>
    </p>

    <form className="mt-8 space-y-5">
      {/* Fields */}
      <button type="submit" className="gh-button-primary w-full">Sign in</button>
    </form>

    {/* Divider */}
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--border-subtle)]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[var(--background)] px-4 text-xs text-muted">or continue with</span>
      </div>
    </div>

    {/* Google OAuth */}
    <button className="gh-button-secondary w-full gap-3">
      <GoogleIcon /> Continue with Google
    </button>
  </div>
</div>
```

**Right (brand visual):**
```tsx
<div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-[#0d1730] p-12">
  {/* Real UAE photography background */}
  <img className="absolute inset-0 h-full w-full object-cover opacity-20" src="..." />
  <div className="relative">
    {/* Trust stats */}
    {/* Quote from imaginary user */}
    {/* Feature highlights */}
  </div>
</div>
```

---

## 5. CONTENT RULES

### Headlines — What to Write
Every headline must be direct, specific, and user-outcome-focused.

| ❌ DO NOT USE | ✅ USE INSTEAD |
|---|---|
| "Trust-first public discovery" | "Find what you need across the UAE" |
| "Premium operator profiles" | "Verified agencies, dealers, and businesses" |
| "Launch-ready banner zone" | "Sponsor a section" or just show the ad slot |
| "Permit-backed visibility" | "Every Dubai property is permit-verified" |
| "Cleaner posting rules" | "No spam. Every listing is reviewed" |
| "Stronger content surfaces" | "Browse the latest listings" |
| "Marina-facing apartment with permit-backed visibility" | "3BR Apartment, Dubai Marina, Sea View — AED 2.45M" |

### Copy Tone
- Direct, confident, warm
- Short sentences
- Active voice
- UAE-aware (use AED, not $; say "emirates" not "states")

### Numbers to Use (use consistently)
- "47,000+ listings" — or whatever real number from Supabase
- "7 Emirates" — always
- "Free to post" — always prominent
- "Verified operators" — not "premium operators"

---

## 6. MOTION / ANIMATION

Keep animations subtle and purposeful.

### Rules
- Hover lift: `transition hover:-translate-y-1` — use on all interactive cards
- Hover arrow: `transition group-hover:translate-x-1` — use on "Open detail" arrows
- Button press: `active:scale-[0.98]` — add to all buttons
- Image zoom: `transition duration-500 group-hover:scale-[1.03]` — use on card images
- No spinning loaders — use skeleton screens instead
- No bounce animations — only subtle ease
- Duration: 180ms for UI interactions, 300ms for page transitions

### Skeleton Screens
```tsx
<div className="gh-card animate-pulse p-5">
  <div className="aspect-[16/9] rounded-2xl bg-[var(--surface-alt)]" />
  <div className="mt-4 h-4 w-3/4 rounded-full bg-[var(--surface-alt)]" />
  <div className="mt-2 h-3 w-1/2 rounded-full bg-[var(--surface-alt)]" />
</div>
```

---

## 7. RESPONSIVE RULES

### Breakpoints
```
Mobile:  < 640px  — single column, full width everything
Tablet:  640–1024px — 2 columns, sidebar collapses
Desktop: > 1024px — 3 columns, sidebar visible, full nav
Wide:    > 1380px — max width capped at var(--shell-max) = 1380px
```

### Critical Mobile Rules
1. Header on mobile: Logo + Hamburger only (no nav links)
2. Listing grid: always 1 column on mobile
3. Filter bar: horizontal scroll, no wrapping
4. Contact panel on listing detail: moves BELOW the content on mobile (not sticky sidebar)
5. Admin panel on mobile: sidebar becomes bottom tab bar with 5 icons max
6. All buttons: minimum height `44px` (touch target)
7. All inputs: minimum height `48px`

---

## 8. IMAGES

### Hero Images (Unsplash — already in use)
These are approved for use in development/staging:
```
UAE/Dubai cityscape: https://images.unsplash.com/photo-1512917774080-9991f1c4c750
Modern apartment:   https://images.unsplash.com/photo-1600585154526-990dced4db0d
Luxury car:         https://images.unsplash.com/photo-1492144534655-ae79c964c9d7
Business meeting:   https://images.unsplash.com/photo-1520607162513-77705c0f0d4a
Dubai skyline:      https://images.unsplash.com/photo-1580674684081-7617fbf3d745
Office space:       https://images.unsplash.com/photo-1497366216548-37526070297c
```

Always add `?auto=format&fit=crop&w=1200&q=80` to Unsplash URLs.

### Image Loading
- Always use `loading="lazy"` on below-fold images
- Always provide `alt` text
- Use `object-cover` on contained images
- Use `aspect-[16/9]` or `aspect-[4/3]` containers — never arbitrary heights

---

## 9. WHAT CODEX MUST DO NEXT — PRIORITY ORDER

### Step 1 — Fix Section Icons Everywhere (1 hour)
Replace all letter-placeholder icons with Lucide icons across:
- `app/(public)/page.tsx` — section tiles
- `components/app-shell.tsx` — logo mark (replace "G" letter)
- Any other component using letter placeholders

### Step 2 — Fix Homepage Copy (2 hours)
Update `app/(public)/page.tsx`:
- Replace all internal-language headlines with user-facing copy (see table in Section 5)
- Replace featured card titles with real-looking listing titles
- Add stats strip below hero: `47,000+ listings | 7 Emirates | Free to join`
- Trust section: replace vague claims with specific ones

### Step 3 — Property Browse Page (3 hours)
Update `app/(public)/property/page.tsx`:
- Implement the browse layout from Section 4.2
- Real filter chips: Purpose (Buy/Rent), Bedrooms, Price range, Emirate, Property type
- Listing grid with proper Listing Card component
- Sort controls

### Step 4 — Motors Browse Page (2 hours)
Update `app/(public)/motors/page.tsx`:
- Filter chips: Brand, Year, Price, Condition, Emirate
- Same Listing Card pattern

### Step 5 — Jobs Browse Page (2 hours)
Update `app/(public)/jobs/page.tsx`:
- Filter chips: Category, Emirate, Salary, Employment type
- Job card variant: title + company + location + salary range + employment type badge

### Step 6 — Services Browse Page (2 hours)
Update `app/(public)/services/page.tsx`:
- Filter chips: Category, Emirate, Emergency, Verified
- Provider card: photo + name + category + rating + location + CTA

### Step 7 — Property Detail Page (3 hours)
Update `app/(public)/property/listing/[listingSlug]/page.tsx`:
- Full layout from Section 4.3
- Image gallery
- Content + sticky contact panel
- Similar listings

### Step 8 — Motors Detail Page (2 hours)
Same pattern as property detail but with motor-specific attributes.

### Step 9 — Admin Sidebar (2 hours)
Update `app/(admin)/layout.tsx`:
- Implement dark sidebar from Section 4.5
- Proper icons for every nav item
- Active state
- User info at bottom

### Step 10 — Dashboard (2 hours)
Update `app/(workspace)/dashboard/page.tsx`:
- KPI strip
- Quick actions
- Recent listings table
- Recent leads

---

## 10. DO NOT DO LIST

Codex must NEVER do the following:

1. ❌ Use letter placeholders (`P`, `M`, `J`) instead of Lucide icons
2. ❌ Use internal language in user-facing copy ("trust-first", "launch-ready", "permit-backed")
3. ❌ Create new CSS classes — use existing `gh-*` classes and Tailwind
4. ❌ Use inline `style={}` props — use Tailwind classes or CSS variables
5. ❌ Create new colour values — use the token system in `globals.css`
6. ❌ Build without mobile view — every component must work at 375px width
7. ❌ Add `console.log` statements to production code
8. ❌ Hard-code text content that should come from Supabase
9. ❌ Use `<img>` without `alt` text
10. ❌ Skip loading/skeleton states on data-fetching components
11. ❌ Build modal/dialog components from scratch — use Radix UI primitives
12. ❌ Use emoji as icons — always use Lucide SVG icons
13. ❌ Use `px-` values not on the token scale
14. ❌ Create full-page layouts without testing at mobile breakpoint first

---

## 11. VERIFICATION CHECKLIST FOR EACH COMPONENT

Before marking any component as done, verify:

- [ ] Works at 375px (iPhone SE width)
- [ ] Works at 768px (tablet)
- [ ] Works at 1280px (desktop)
- [ ] Dark mode looks premium (not just inverted)
- [ ] Hover states are smooth (no jarring jumps)
- [ ] All images have `alt` text
- [ ] No letter placeholder icons
- [ ] No internal/developer language in copy
- [ ] TypeScript: no `any` types
- [ ] `npm run typecheck` passes
- [ ] `npm run build` in `apps/web` passes

---

## 12. DEPLOYMENT TARGET

Current hosting (Milesweb cPanel) has NO Node.js runtime — cannot host Next.js.

Target deployment: **Vercel**
- Free tier is sufficient for current stage
- Connect GitHub repo → auto-deploys on push
- Environment variables set in Vercel dashboard (not committed to repo)
- Custom domain: `gulfhabibi.com` → point in Cloudflare to Vercel

Required env vars for Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://chfkssclmdshdcijfzdr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key — safe to expose]
SUPABASE_SERVICE_ROLE_KEY=[service role — NEVER expose to frontend]
```

---

END OF DESIGN BRIEF
