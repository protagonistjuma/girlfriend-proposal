(function () {
  const clips = document.querySelectorAll("video[autoplay]");
  if (!clips.length) return;

  const play = (v) => {
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  const kick = () => clips.forEach(play);

  kick();

  const once = () => {
    kick();
    window.removeEventListener("touchstart", once);
    window.removeEventListener("click", once);
  };
  window.addEventListener("touchstart", once, { passive: true });
  window.addEventListener("click", once);
})();
