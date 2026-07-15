/* Android's autoplay rules are stricter than the HTML attributes imply
   (Data Saver and battery-saver can block a muted <video>). This nudges
   every autoplay clip into playing, and falls back to the first tap. */
(function () {
  const clips = document.querySelectorAll("video[autoplay]");
  if (!clips.length) return;

  const play = (v) => {
    v.muted = true; // some Android builds need the property, not just the attr
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const kick = () => clips.forEach(play);

  kick();

  // if the browser refused, start them on the first interaction instead
  const once = () => {
    kick();
    window.removeEventListener("touchstart", once);
    window.removeEventListener("click", once);
  };
  window.addEventListener("touchstart", once, { passive: true });
  window.addEventListener("click", once);
})();
