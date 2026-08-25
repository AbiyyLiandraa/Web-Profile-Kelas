document.addEventListener('DOMContentLoaded', () => {
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-nav__link, .site-nav a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const linkPage = (href.split('/').pop().split('#')[0] || 'index.html').toLowerCase();
    if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', (event) => {
      const targetPage = link.getAttribute('href');
      if (!targetPage || targetPage.startsWith('#') || link.target === '_blank') return;
      // allow modified clicks
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => {
        try { window.location.href = targetPage; } catch { window.location.assign(targetPage); }
      }, 160);
    });
  });
  // professional: image fallback — hide broken, keep layout
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const frame = img.closest('.shot__frame, .hero__preview');
      if (frame && !frame.querySelector('.img-fallback')) {
        const f = document.createElement('div');
        f.className = 'img-fallback';
        f.setAttribute('aria-hidden','true');
        f.style.cssText = 'position:absolute; inset:0; display:grid; place-items:center; background:var(--surface-2); color:var(--ink-faint); font:600 11px var(--font-mono); letter-spacing:.08em; text-transform:uppercase';
        f.textContent = 'Gambar tidak tersedia';
        frame.style.position = 'relative';
        frame.appendChild(f);
      }
    }, { once: true });
  });
  // respect reduced-motion: disable page transition delay
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.body.classList.add('page-ready');
  else requestAnimationFrame(() => document.body.classList.add('page-ready'));
});
