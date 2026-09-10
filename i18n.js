(() => {
  'use strict';
  const inPresentation = /\/apresentacao\/?(?:$|[?#])/.test(location.pathname + location.search + location.hash) || location.pathname.includes('/apresentacao/');
  const prefix = inPresentation ? '../' : '';

  if (inPresentation) {
    const guard = document.createElement('script');
    guard.src = `gesture-guard.js?v=20260910-1`;
    guard.defer = true;
    document.head.appendChild(guard);
  }

  const core = document.createElement('script');
  core.src = `${prefix}i18n-complete.js?v=20260908-3`;
  core.defer = true;
  core.onload = () => {
    const fixes = document.createElement('script');
    fixes.src = `${prefix}i18n-fixes.js?v=20260908-2`;
    fixes.defer = true;
    document.head.appendChild(fixes);
  };
  document.head.appendChild(core);
})();