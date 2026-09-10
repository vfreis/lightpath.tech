(() => {
  'use strict';

  if (window.__lpGestureGuardInstalled) return;
  window.__lpGestureGuardInstalled = true;

  let locked = false;
  let accumulator = 0;
  let direction = 0;
  let releaseTimer = null;
  let lastEventAt = 0;

  /* Trackpad inertia typically emits events every ~8–40 ms. A new intentional
     gesture normally starts after a short idle gap. Keep the idle release short
     enough to avoid "dead" scrolls, but long enough to absorb inertial tails. */
  const IDLE_RELEASE_MS = 170;
  const NEW_GESTURE_GAP_MS = 150;
  const TRIGGER_THRESHOLD_PX = 48;

  const releaseGesture = () => {
    locked = false;
    accumulator = 0;
    direction = 0;
  };

  const scheduleRelease = () => {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(releaseGesture, IDLE_RELEASE_MS);
  };

  const normalizeDelta = event => {
    const primary = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (event.deltaMode === 1) return primary * 16;
    if (event.deltaMode === 2) return primary * Math.max(window.innerHeight, 1);
    return primary;
  };

  const move = sign => {
    const control = document.getElementById(sign > 0 ? 'next-scene' : 'prev-scene');
    if (control && !control.disabled) control.click();
  };

  /* Capture on window, not only #story. The appbar, language switch and bottom
     dock are part of the presentation too; wheel gestures over them must behave
     exactly like gestures over the slide. */
  window.addEventListener('wheel', event => {
    if (event.ctrlKey) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const now = performance.now();
    const gap = lastEventAt ? now - lastEventAt : Infinity;
    lastEventAt = now;

    /* A real idle gap starts a fresh gesture immediately, even if a previous
       release timer has not fired yet. */
    if (gap > NEW_GESTURE_GAP_MS) releaseGesture();

    const delta = normalizeDelta(event);
    if (Math.abs(delta) < 0.8) {
      scheduleRelease();
      return;
    }

    scheduleRelease();
    if (locked) return;

    const nextDirection = Math.sign(delta);
    if (direction && nextDirection !== direction) accumulator = 0;
    direction = nextDirection;
    accumulator += delta;

    if (Math.abs(accumulator) < TRIGGER_THRESHOLD_PX) return;

    locked = true;
    accumulator = 0;
    move(direction);
  }, { capture: true, passive: false });

  window.addEventListener('blur', releaseGesture, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) releaseGesture();
  });
})();
