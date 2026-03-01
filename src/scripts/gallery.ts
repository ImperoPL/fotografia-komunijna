import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

function initMasonry() {
  const grid = document.getElementById("masonry-gallery");
  if (!grid) return;

  const msnry = new Masonry(grid, {
    itemSelector: ".masonry-item",
    columnWidth: ".masonry-item",
    percentPosition: true,
    gutter: 16,
    transitionDuration: 0,
  });

  // Re-layout after all images have loaded
  const imgLoad = imagesLoaded(grid);
  imgLoad.on("progress", () => {
    msnry.layout();
  });
}

function initPhotoSwipe() {
  const lightbox = new PhotoSwipeLightbox({
    gallery: ".pswp-gallery",
    children: "a.masonry-item",
    pswpModule: () => import("photoswipe"),
    bgOpacity: 0.9,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
  });

  lightbox.init();
  return lightbox;
}

// Initialize on first load
initMasonry();
let lightbox = initPhotoSwipe();

// Re-initialize on Astro page navigation (View Transitions)
document.addEventListener("astro:after-swap", () => {
  initMasonry();
  lightbox?.destroy();
  lightbox = initPhotoSwipe();
});
