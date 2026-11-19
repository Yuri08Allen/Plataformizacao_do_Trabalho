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
  const figure = image.closest("figure");

  if (figure && !figure.querySelector("figcaption")) {
    const caption = document.createElement("figcaption");
    caption.textContent = image.alt;
    image.after(caption);
  }

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

// Fogos decorativos nas seções de encerramento
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reducedMotionPreference.matches) {
  document.querySelectorAll(".fireworks-section").forEach((section) => {
    const fireworksCanvas = section.querySelector(".conclusion-fireworks");
    const fireworksContext = fireworksCanvas?.getContext("2d");

    if (!fireworksCanvas || !fireworksContext) return;

    const fireworksColors = ["#b99853", "#8d7c58", "#b06b4f", "#6e6346"];
    const rockets = [];
    const sparks = [];
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pixelRatio = 1;
    let previousFrame = 0;
    let launchClock = 0;
    let animationFrame = 0;

    function resizeFireworksCanvas() {
      const bounds = fireworksCanvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = bounds.width;
      canvasHeight = bounds.height;
      fireworksCanvas.width = Math.round(canvasWidth * pixelRatio);
      fireworksCanvas.height = Math.round(canvasHeight * pixelRatio);
      fireworksContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function launchRocket() {
      rockets.push({
        x: canvasWidth * (0.12 + Math.random() * 0.76),
        y: canvasHeight + 8,
        targetY: canvasHeight * (0.2 + Math.random() * 0.25),
        speed: 210 + Math.random() * 90,
        color: fireworksColors[Math.floor(Math.random() * fireworksColors.length)],
      });
    }

    function burstRocket(rocket) {
      const sparkCount = 36 + Math.floor(Math.random() * 20);

      for (let index = 0; index < sparkCount; index += 1) {
        const angle = (Math.PI * 2 * index) / sparkCount + Math.random() * 0.12;
        const speed = 35 + Math.random() * 105;
        const lifetime = 1.2 + Math.random() * 0.8;

        sparks.push({
          x: rocket.x,
          y: rocket.y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          age: 0,
          lifetime,
          radius: 1.2 + Math.random() * 1.8,
          color: rocket.color,
        });
      }
    }

    function drawFireworks(timestamp) {
      const elapsed = previousFrame ? Math.min((timestamp - previousFrame) / 1000, 0.04) : 0.016;
      previousFrame = timestamp;
      launchClock += elapsed;
      fireworksContext.clearRect(0, 0, canvasWidth, canvasHeight);

      if (launchClock > 0.9) {
        launchRocket();
        launchClock = 0;
      }

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];
        rocket.y -= rocket.speed * elapsed;
        fireworksContext.globalAlpha = 0.88;
        fireworksContext.fillStyle = rocket.color;
        fireworksContext.beginPath();
        fireworksContext.arc(rocket.x, rocket.y, 2.2, 0, Math.PI * 2);
        fireworksContext.fill();

        if (rocket.y <= rocket.targetY) {
          burstRocket(rocket);
          rockets.splice(index, 1);
        }
      }

      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.age += elapsed;
        spark.x += spark.velocityX * elapsed;
        spark.y += spark.velocityY * elapsed;
        spark.velocityY += 38 * elapsed;

        if (spark.age >= spark.lifetime) {
          sparks.splice(index, 1);
          continue;
        }

        fireworksContext.globalAlpha = 1 - spark.age / spark.lifetime;
        fireworksContext.fillStyle = spark.color;
        fireworksContext.beginPath();
        fireworksContext.arc(spark.x, spark.y, spark.radius, 0, Math.PI * 2);
        fireworksContext.fill();
      }

      fireworksContext.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(drawFireworks);
    }

    resizeFireworksCanvas();
    window.addEventListener("resize", resizeFireworksCanvas);

    const fireworksObserver = new IntersectionObserver((entries) => {
      const sectionIsVisible = entries.some((entry) => entry.isIntersecting);

      if (sectionIsVisible && !animationFrame) {
        previousFrame = 0;
        animationFrame = window.requestAnimationFrame(drawFireworks);
      } else if (!sectionIsVisible && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        previousFrame = 0;
      }
    }, { threshold: 0.05 });

    fireworksObserver.observe(section);
  });
}
