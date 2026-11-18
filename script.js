// Navegação do menu responsivo
const menuButton = document.querySelector("#menu-toggle");
const navigationMenu = document.querySelector("#site-nav");

menuButton.addEventListener("click", () => {
  const menuIsOpen = navigationMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(menuIsOpen));
});

navigationMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigationMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// Estado da visualização ampliada
const lightbox = document.querySelector("#media-lightbox");
const lightboxStage = document.querySelector("#lightbox-stage");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxCloseButton = document.querySelector("#lightbox-close");

let elementToFocusAfterClose = null;

function openLightbox(mediaElement, caption) {
  elementToFocusAfterClose = document.activeElement;

  lightboxStage.replaceChildren(mediaElement);
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;

  document.body.classList.add("lightbox-open");
  lightboxCloseButton.focus();
}

function closeLightbox() {
  const activeVideo = lightboxStage.querySelector("video");

  if (activeVideo) {
    activeVideo.pause();
  }

  lightbox.hidden = true;
  lightboxStage.replaceChildren();
  document.body.classList.remove("lightbox-open");

  if (elementToFocusAfterClose) {
    elementToFocusAfterClose.focus();
  }
}

// Imagens ampliáveis
const imagesThatCanZoom = document.querySelectorAll(
  ".editorial-figure img, .qr-figure img",
);

imagesThatCanZoom.forEach((image) => {
  const zoomButton = document.createElement("button");

  zoomButton.type = "button";
  zoomButton.className = "image-zoom-trigger";
  zoomButton.setAttribute("aria-label", `Ampliar imagem: ${image.alt}`);

  image.before(zoomButton);
  zoomButton.append(image);

  zoomButton.addEventListener("click", () => {
    const enlargedImage = new Image();

    enlargedImage.src = image.src;
    enlargedImage.alt = image.alt;

    openLightbox(enlargedImage, image.alt);
  });
});

// Vídeos ampliáveis
const videoExpandButtons = document.querySelectorAll(".expand-video");

videoExpandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const enlargedVideo = document.createElement("video");

    enlargedVideo.src = button.dataset.src;
    enlargedVideo.controls = true;
    enlargedVideo.autoplay = true;
    enlargedVideo.playsInline = true;
    enlargedVideo.preload = "metadata";

    openLightbox(enlargedVideo, button.dataset.title);
  });
});

// Formas de fechar a visualização ampliada
lightboxCloseButton.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  const escapePressed = event.key === "Escape";
  const lightboxIsOpen = !lightbox.hidden;

  if (escapePressed && lightboxIsOpen) {
    closeLightbox();
  }
});
