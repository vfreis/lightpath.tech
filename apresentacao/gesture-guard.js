(() => {
  'use strict';

  const root = document.getElementById('story');
  if (!root) return;

  let gestureLocked = false;
  let accumulator = 0;
  let direction = 0;
  let releaseTimer = null;

  const RELEASE_AFTER_IDLE_MS = 520;
  const TRIGGER_THRESHOLD_PX = 58;

  const releaseGesture = () => {
    gestureLocked = false;
    accumulator = 0;
    direction = 0;
  };

  const scheduleRelease = () => {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(releaseGesture, RELEASE_AFTER_IDLE_MS);
  };

  const normalizeDelta = event => {
    const primary = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (event.deltaMode === 1) return primary * 16;
    if (event.deltaMode === 2) return primary * Math.max(window.innerHeight, 1);
    return primary;
  };

  root.addEventListener('wheel', event => {
    if (event.ctrlKey) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const delta = normalizeDelta(event);
    if (Math.abs(delta) < 0.8) return;

    scheduleRelease();

    if (gestureLocked) return;

    const nextDirection = Math.sign(delta);
    if (direction && nextDirection !== direction) accumulator = 0;
    direction = nextDirection;
    accumulator += delta;

    if (Math.abs(accumulator) < TRIGGER_THRESHOLD_PX) return;

    gestureLocked = true;
    accumulator = 0;

    const control = document.getElementById(direction > 0 ? 'next-scene' : 'prev-scene');
    if (control && !control.disabled) control.click();
  }, { capture: true, passive: false });

  window.addEventListener('blur', releaseGesture, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releaseGesture();
  });
})();
