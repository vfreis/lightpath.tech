(() => {
  'use strict';

  if (window.__lpPresentationLayoutGuard) return;
  window.__lpPresentationLayoutGuard = true;

  const scenes = [...document.querySelectorAll('.scene')];
  let timer = null;

  const number = value => Number.parseFloat(value) || 0;
  const visible = el => {
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && number(style.opacity) !== 0;
  };

  const constrain = scene => {
    if (!scene || !scene.classList.contains('is-active')) return;
    const inner = scene.querySelector('.scene-inner');
    if (!inner) return;

    const sceneRect = scene.getBoundingClientRect();
    let innerRect = inner.getBoundingClientRect();
    let scale = number(getComputedStyle(inner).getPropertyValue('--scene-fit')) || 1;
    let changed = false;

    /* Three small correction passes are enough for browser/font rounding. */
    for (let pass = 0; pass < 3; pass += 1) {
      const safeW = Math.max(1, sceneRect.width - 8);
      const safeH = Math.max(1, sceneRect.height - 8);
      const overflowX = innerRect.left < sceneRect.left + 4 || innerRect.right > sceneRect.right - 4;
      const overflowY = innerRect.top < sceneRect.top + 4 || innerRect.bottom > sceneRect.bottom - 4;

      if (!overflowX && !overflowY) break;

      const ratioW = overflowX ? safeW / Math.max(innerRect.width, 1) : 1;
      const ratioH = overflowY ? safeH / Math.max(innerRect.height, 1) : 1;
      const ratio = Math.min(1, ratioW, ratioH) * .985;
      const next = Math.max(.46, scale * ratio);
      if (Math.abs(next - scale) < .002) break;

      scale = next;
      inner.style.setProperty('--scene-fit', scale.toFixed(4));
      innerRect = inner.getBoundingClientRect();
      changed = true;
    }

    /* Verify the major normal-flow blocks do not collide with one another.
       Absolute decorative children are intentionally ignored. */
    const blocks = [...inner.children].filter(el => visible(el) && getComputedStyle(el).position !== 'absolute');
    let collision = false;
    for (let i = 0; i < blocks.length; i += 1) {
      const a = blocks[i].getBoundingClientRect();
      for (let j = i + 1; j < blocks.length; j += 1) {
        const b = blocks[j].getBoundingClientRect();
        const overlapW = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapH = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapW > 6 && overlapH > 6) {
          /* Side-by-side grid columns can overlap on one axis by definition;
             only treat substantial area intersection as a collision. */
          const area = overlapW * overlapH;
          const smallest = Math.min(Math.max(1, a.width * a.height), Math.max(1, b.width * b.height));
          if (area / smallest > .08) collision = true;
        }
      }
    }

    scene.dataset.layoutStatus = collision ? 'collision-guarded' : (changed ? 'constrained' : 'safe');
    scene.dataset.layoutScale = scale.toFixed(3);
  };

  const run = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const active = document.querySelector('.scene.is-active');
      if (!active) return;
      requestAnimationFrame(() => {
        constrain(active);
        requestAnimationFrame(() => constrain(active));
      });
    }, 36);
  };

  window.addEventListener('resize', run, { passive: true });
  window.addEventListener('orientationchange', run, { passive: true });
  window.addEventListener('lightpath:languagechange', () => {
    run();
    setTimeout(run, 240);
  });
  window.visualViewport?.addEventListener('resize', run, { passive: true });
  window.visualViewport?.addEventListener('scroll', run, { passive: true });

  document.addEventListener('click', event => {
    if (!event.target.closest('.scene, .story-controls, .lp-language-toggle')) return;
    run();
    setTimeout(run, 420);
  }, { passive: true });

  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' && record.attributeName === 'class' && record.target.classList?.contains('scene'))) run();
  });
  scenes.forEach(scene => observer.observe(scene, { attributes: true, attributeFilter: ['class'] }));

  if (document.fonts?.ready) document.fonts.ready.then(run).catch(() => {});
  window.addEventListener('load', run, { once: true });
  run();
})();
