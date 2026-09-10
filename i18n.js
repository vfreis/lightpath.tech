(() => {
  'use strict';
  const inPresentation = location.pathname.includes('/apresentacao/');

  if (inPresentation) {
    const presentationI18n = document.createElement('script');
    presentationI18n.src = 'presentation-i18n.js?v=20260910-v3';
    presentationI18n.defer = true;
    document.head.appendChild(presentationI18n);
    return;
  }

  const core = document.createElement('script');
  core.src = 'i18n-complete.js?v=20260908-3';
  core.defer = true;
  core.onload = () => {
    const fixes = document.createElement('script');
    fixes.src = 'i18n-fixes.js?v=20260908-2';
    fixes.defer = true;
    document.head.appendChild(fixes);
  };
  document.head.appendChild(core);
})();