(() => {
  'use strict';
  const inPresentation = /\/apresentacao\/?(?:$|[?#])/.test(location.pathname + location.search + location.hash) || location.pathname.includes('/apresentacao/');
  const prefix = inPresentation ? '../' : '';

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