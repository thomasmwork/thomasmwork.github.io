/* Scroll effects for browsers without CSS scroll-driven animations.
   Where `animation-timeline` is supported, styles.css drives the progress bar and the
   section reveals on its own and this file does nothing. */
(() => {
  const supportsScrollTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (supportsScrollTimeline || prefersReducedMotion) return;

  const root = document.documentElement;
  const bar = document.querySelector('.progress');
  root.classList.add('scroll-fallback');

  // Only blocks still below the fold start hidden, so nothing on screen (or already scrolled past) flashes.
  let pending = [...document.querySelectorAll('.reveal')]
    .filter((el) => el.getBoundingClientRect().top >= window.innerHeight);
  pending.forEach((el) => el.classList.add('will-reveal'));

  let frame = 0;

  const update = () => {
    frame = 0;

    if (bar) {
      const max = root.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    }

    const line = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top >= line) return true;
      el.classList.add('is-in');
      return false;
    });
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
