(() => {
  'use strict';
  const inPresentation = /\/apresentacao\/?(?:$|[?#])/.test(location.pathname + location.search + location.hash) || location.pathname.includes('/apresentacao/');
  const script = document.createElement('script');
  script.src = `${inPresentation ? '../' : ''}i18n-complete.js?v=20260908-2`;
  script.defer = true;
  document.head.appendChild(script);
})();
