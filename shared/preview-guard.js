(() => {
  const previewHosts = new Set([
    'natuaralcureguide.com',
    'www.natuaralcureguide.com'
  ]);

  if (!previewHosts.has(window.location.hostname)) return;

  const path = window.location.pathname || '/';
  if (path === '/' || path.endsWith('/index.html') || path.endsWith('/preview-login.html')) {
    return;
  }

  const hasCookie = document.cookie.split(';').some(part => part.trim() === 'gh_preview=1');
  const hasSession = window.sessionStorage.getItem('gb_auth') === '1';

  if (hasSession && !hasCookie) {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = 'gh_preview=1; path=/; max-age=86400; SameSite=Lax' + secure;
  }

  if (hasCookie || hasSession) return;

  const next = encodeURIComponent(window.location.pathname + window.location.search + window.location.hash);
  window.location.replace('/index.html?next=' + next);
})();
