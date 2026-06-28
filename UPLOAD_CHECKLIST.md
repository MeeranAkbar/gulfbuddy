# GulfHabibi — Upload & Go-Live Checklist
Last Updated: 22 March 2026

## BEFORE YOU UPLOAD ANYTHING

### Step 1 — Deploy Cloudflare Worker (do this FIRST)
1. Go to https://workers.cloudflare.com → Log in → Create Application → Create Worker
2. Name it: `gulfhabibi-proxy`
3. Paste the entire contents of `cloudflare-worker.js`
4. Click Deploy
5. Go to Settings → Variables & Secrets → Add these (as Secrets, not plain text):
   - `GROQ_API_KEY`         = <REMOVED_API_KEY>
   - `GEMINI_API_KEY`       = <REMOVED_API_KEY>
   - `SUPABASE_URL`         = https://chfkssclmdshdcijfzdr.supabase.co
   - `SUPABASE_SERVICE_KEY` = [Get from Supabase → Settings → API → service_role key]
   - `ALLOWED_ORIGIN`       = https://gulfhabibi.com
   - `ALLOWED_ORIGIN_2`     = https://www.gulfhabibi.com
   - `ADMIN_EMAIL`          = your admin email address
6. Copy your Worker URL (looks like: https://gulfhabibi-proxy.YOURNAME.workers.dev)
7. Open `shared/config.js` → replace `YOUR-NAME` in PROXY_URL with your actual worker URL

### Step 2 — Run SQL in Supabase
Go to: https://supabase.com/dashboard/project/chfkssclmdshdcijfzdr/sql
Run IN THIS ORDER:
1. `MASTER_SQL.sql`
2. `FINAL_services_sql.sql`
3. `ai_audit_log.sql`
DO NOT run `fix_rls_public.sql` on production — it weakens security.

### Step 3 — Update Supabase Auth Settings
Go to: Supabase → Authentication → URL Configuration
- Site URL: https://gulfhabibi.com
- Add to Redirect URLs: https://gulfhabibi.com/**, https://www.gulfhabibi.com/**

### Step 4 — Set Admin User
Go to: Supabase → Authentication → Users → find your account → Edit
- In app_metadata add: {"role": "admin"}
- Save

---

## UPLOADING TO MILESWEB HOSTING

### Hosting Details
- cPanel URL: imperial.herosite.pro:2083
- Username: qukugdyc
- Server path: ~/natuaralcureguide.com/ (until gulfhabibi.com DNS is pointed)

### Files TO UPLOAD (all of these)
Upload everything EXCEPT the files in the DO NOT UPLOAD list below.

### Files DO NOT UPLOAD
These must NEVER go to the server:
- `cloudflare-worker.js` (stays local — deployed to Cloudflare only)
- `*.py` (Python scripts — local tools only)
- `*.sql` (SQL files — run in Supabase only, not needed on web server)
- `PROJECT_LOG.md`
- `Detail Audit for Clas.txt`
- `UPLOAD_CHECKLIST.md` (this file)
- `pricing Idea.docx`
- `Pricing Ideas/` folder
- `Home Page Ref.jpg`
- `check.py`, `rebrand.py`, `replace_icons.py`, etc.
- `.htpasswd` (only upload .htaccess)

### How to Upload (via cPanel File Manager)
1. Log into cPanel: imperial.herosite.pro:2083
2. Open File Manager → navigate to ~/natuaralcureguide.com/
3. Delete old files if any
4. Upload a ZIP of the project (excluding DO NOT UPLOAD files above)
5. Extract the ZIP in the file manager
6. Make sure .htaccess is in the ROOT of the domain folder

### DNS — Point gulfhabibi.com to Milesweb
1. Log into your domain registrar (where gulfhabibi.com is registered)
2. Set A Record: @ → [Milesweb server IP — get from cPanel → Server Information]
3. Set CNAME: www → gulfhabibi.com
4. DNS propagation: 2-24 hours

---

## POST-UPLOAD CHECKS
- [ ] https://gulfhabibi.com loads (not the preview site)
- [ ] HTTPS green padlock shows
- [ ] Sign up / Sign in works
- [ ] Post a test listing → appears in admin panel
- [ ] Admin panel (gb-admin-ctrl.html) requires real login
- [ ] AI description writer works on post forms (calls worker)
- [ ] .sql, .md, .py files return 403 Forbidden if accessed by URL
- [ ] Worker URL returns 403 for requests from outside gulfhabibi.com

---

## SECURITY ITEMS REMAINING (post-launch)
- [ ] Apply for Consumer Protection Badge at consumerrights.ae
- [ ] Set up PayTabs payment gateway
- [ ] Move all inline `<script>` blocks to external .js files (removes need for CSP unsafe-inline)
- [ ] Create logo design
- [ ] Enable Google OAuth in Supabase (Auth → Providers → Google)
