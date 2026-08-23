document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav__link, .site-nav a').forEach((link) => {
    const linkPage = link.getAttribute('href').split('/').pop().split('#')[0] || 'index.html';
    if (linkPage === currentPage) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', (event) => {
      const targetPage = link.getAttribute('href');
      if (!targetPage || targetPage.startsWith('#') || link.target === '_blank') return;
      event.preventDefault();
      document.body.classList.add('page-leaving');
      window.setTimeout(() => { window.location.href = targetPage; }, 160);
    });
  });

  document.body.classList.add('page-ready');
});
