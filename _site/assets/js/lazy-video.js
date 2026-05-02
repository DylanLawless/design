document.addEventListener("click", function (event) {
  const button = event.target.closest(".lazy-video-button");

  if (!button) return;

  const wrap = button.closest(".lazy-video");
  if (!wrap) return;

  const src = wrap.dataset.videoSrc;
  if (!src) return;

  const video = document.createElement("video");
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.className = "lazy-video-player";

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";

  video.appendChild(source);
  wrap.replaceChildren(video);

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(function () {
      video.controls = true;
    });
  }
});
