const menuButton = document.querySelector('#menu-toggle');
const menu = document.querySelector('#site-nav');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const lightbox = document.querySelector('#media-lightbox');
const lightboxStage = document.querySelector('#lightbox-stage');
const lightboxCaption = document.querySelector('#lightbox-caption');
const closeButton = document.querySelector('#lightbox-close');
let returnFocus = null;

function openLightbox(media, title) {
  returnFocus = document.activeElement;
  lightboxStage.replaceChildren(media);
  lightboxCaption.textContent = title;
  lightbox.hidden = false;
  document.body.classList.add('lightbox-open');
  closeButton.focus();
}
function closeLightbox() {
  const video = lightboxStage.querySelector('video');
  if (video) video.pause();
  lightbox.hidden = true;
  lightboxStage.replaceChildren();
  document.body.classList.remove('lightbox-open');
  if (returnFocus) returnFocus.focus();
}

document.querySelectorAll('.editorial-figure img, .qr-figure img').forEach(image => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'image-zoom-trigger';
  button.setAttribute('aria-label', `Ampliar imagem: ${image.alt}`);
  image.before(button);
  button.append(image);
  button.addEventListener('click', () => {
    const enlarged = new Image();
    enlarged.src = image.src;
    enlarged.alt = image.alt;
    openLightbox(enlarged, image.alt);
  });
});

document.querySelectorAll('.expand-video').forEach(button => {
  button.addEventListener('click', () => {
    const video = document.createElement('video');
    video.src = button.dataset.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata';
    openLightbox(video, button.dataset.title);
  });
});

closeButton.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });
