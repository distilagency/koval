export const getPageSlugFromWpLink = (wpLink, wordPressUrl) => {
  if (!wpLink) return null;
  return wpLink.replace(wordPressUrl, '');
}

export const scrollTo = (elementY, duration) => {
  if (typeof window !== 'undefined') {
    const startingY = window.pageYOffset;
    const diff = elementY - startingY;
    let start;

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      const time = timestamp - start;
      // Get percent of completion in range [0, 1].
      const percent = Math.min(time / duration, 1);
      window.scrollTo({
        top: startingY + diff * percent,
        left: 0,
        behaviour: 'smooth'
      });

      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    })
  }
}
