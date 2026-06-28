// ===== GULFHABIBI AUTH — non-module version =====
// Works as a plain <script src> on all pages
// Uses Supabase CDN loaded globally

(function() {
  const SB_URL = 'https://chfkssclmdshdcijfzdr.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZmtzc2NsbWRzaGRjaWpmemRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODc2ODUsImV4cCI6MjA4OTE2MzY4NX0.cbJBIgeDRIqFvk3WMmxRoDWo1C73wM44oBDekdcc3sE';

  // Init Supabase client — wait for CDN to load
  function getSB() {
    if (window._ghSB) return window._ghSB;
    if (window.supabase) {
      window._ghSB = window.supabase.createClient(SB_URL, SB_KEY);
      return window._ghSB;
    }
    return null;
  }

  window.showToast = function(msg, type='success') {
    // Remove existing
    document.querySelectorAll('.gh-toast').forEach(t => t.remove());
    const t = document.createElement('div');
    t.className = 'gh-toast toast-' + type;
    t.textContent = msg;
    t.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
      background:${type==='error'?'#ef4444':'#22c55e'};color:#fff;padding:10px 20px;
      border-radius:8px;font-size:13px;font-weight:600;z-index:99999;
      box-shadow:0 4px 12px rgba(0,0,0,.3)`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  };

  window.openAuth = function(tab) {
    const overlay = document.getElementById('authOverlay');
    if (!overlay) { injectAuthModal(); }
    document.getElementById('authOverlay').classList.add('show');
    if (tab === 'signup') {
      setTimeout(() => {
        const tabs = document.querySelectorAll('.auth-tab');
        if (tabs[1]) window.switchAuthTab('signup', tabs[1]);
      }, 50);
    }
  };

  window.closeAuth = function() {
    document.getElementById('authOverlay')?.classList.remove('show');
  };

  window.switchAuthTab = function(tab, el) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    const signin = document.getElementById('signinForm');
    const signup = document.getElementById('signupForm');
    if (signin) signin.classList.toggle('show', tab === 'signin');
    if (signup) signup.classList.toggle('show', tab === 'signup');
  };

  window.googleSignIn = async function() {
    const sb = getSB();
    if (!sb) { showToast('Auth not ready, try again', 'error'); return; }
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });
  };

  window.doSignIn = async function() {
    const email = document.getElementById('siEmail')?.value.trim();
    const password = document.getElementById('siPassword')?.value;
    if (!email || !password) { showToast('Please fill all fields', 'error'); return; }
    const sb = getSB();
    if (!sb) { showToast('Auth not ready', 'error'); return; }
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { showToast(error.message, 'error'); return; }
    // Store session
    if (data.user) {
      localStorage.setItem('gh_user', JSON.stringify(data.user));
      localStorage.setItem('gh_token', data.session?.access_token || '');
    }
    showToast('Signed in!', 'success');
    closeAuth();
    setTimeout(() => location.reload(), 800);
  };

  window.doSignUp = async function() {
    const name = document.getElementById('suName')?.value.trim();
    const email = document.getElementById('suEmail')?.value.trim();
    const password = document.getElementById('suPassword')?.value;
    if (!name || !email || !password) { showToast('Please fill all fields', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    const sb = getSB();
    if (!sb) { showToast('Auth not ready', 'error'); return; }
    const { error } = await sb.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Account created! Check your email to verify.', 'success');
    closeAuth();
  };

  function injectAuthModal() {
    if (document.getElementById('authOverlay')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div class="auth-overlay" id="authOverlay" onclick="if(event.target===this)closeAuth()">
      <div class="auth-modal">
        <button class="auth-close" onclick="closeAuth()">✕</button>
        <div class="auth-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2" width="32" height="32"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <div class="auth-title">Welcome to GulfHabibi</div>
        <div class="auth-sub">Sign in or create a free account to post listings and more.</div>
        <div class="auth-tabs">
          <button class="auth-tab active" onclick="switchAuthTab('signin',this)">Sign In</button>
          <button class="auth-tab" onclick="switchAuthTab('signup',this)">Sign Up Free</button>
        </div>
        <div class="auth-form show" id="signinForm">
          <input type="email" class="auth-input" id="siEmail" placeholder="Email address">
          <input type="password" class="auth-input" id="siPassword" placeholder="Password">
          <button class="auth-btn" onclick="doSignIn()">Sign In</button>
          <div class="auth-divider">or</div>
          <button class="google-btn" onclick="googleSignIn()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>
        <div class="auth-form" id="signupForm">
          <input type="text" class="auth-input" id="suName" placeholder="Full name">
          <input type="email" class="auth-input" id="suEmail" placeholder="Email address">
          <input type="password" class="auth-input" id="suPassword" placeholder="Password (min 6 characters)">
          <button class="auth-btn" onclick="doSignUp()">Create Free Account</button>
          <div class="auth-divider">or</div>
          <button class="google-btn" onclick="googleSignIn()">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign Up with Google
          </button>
        </div>
      </div>
    </div>`);
  }

  // Check auth state and update navbar
  window.initNavAuth = async function(postUrl) {
    // Load Supabase CDN first
    await loadSupabase();
    injectAuthModal();
    const sb = getSB();
    const el = document.getElementById('authSection');
    if (!sb || !el) return;
    const { data: { session } } = await sb.auth.getSession();
    const guest = document.getElementById('navGuest');
    const navUser = document.getElementById('navUser');
    const nameEl = document.getElementById('navUserName');
    if (session) {
      const name = session.user.user_metadata?.full_name?.split(' ')[0]
        || session.user.email?.split('@')[0] || 'Account';
      if (nameEl) nameEl.textContent = 'Hi, ' + name;
      if (guest) guest.style.display = 'none';
      if (navUser) navUser.style.display = 'flex';
      localStorage.setItem('gh_user', JSON.stringify(session.user));
      localStorage.setItem('gh_token', session.access_token);
      window.signOut = async () => { await sb.auth.signOut(); localStorage.removeItem('gh_user'); localStorage.removeItem('gh_token'); location.reload(); };
    } else {
      if (guest) guest.style.display = 'flex';
      if (navUser) navUser.style.display = 'none';
      localStorage.removeItem('gh_user');
    }
    window.openAuth = openAuth;
  };

  function loadSupabase() {
    return new Promise((resolve) => {
      if (window.supabase) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
      s.onload = resolve;
      s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    await loadSupabase();
    injectAuthModal();
    // Restore session from localStorage for immediate UI update
    const saved = localStorage.getItem('gh_user');
    const guest = document.getElementById('navGuest');
    const navUser = document.getElementById('navUser');
    const nameEl = document.getElementById('navUserName');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const name = u.user_metadata?.full_name?.split(' ')[0] || u.email?.split('@')[0] || 'Account';
        if (nameEl) nameEl.textContent = 'Hi, ' + name;
        if (guest) guest.style.display = 'none';
        if (navUser) navUser.style.display = 'flex';
        window.signOut = async () => {
          const sb = getSB();
          if (sb) await sb.auth.signOut();
          localStorage.removeItem('gh_user');
          localStorage.removeItem('gh_token');
          location.reload();
        };
      } catch(e) {}
    } else {
      if (guest) guest.style.display = 'flex';
      if (navUser) navUser.style.display = 'none';
    }
  });

  // Export for post forms that need the Supabase client
  window.getSupabase = getSB;
  window.SB_URL = SB_URL;
  window.SB_KEY = SB_KEY;
})();
