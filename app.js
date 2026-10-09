const slides = [...document.querySelectorAll('.slide')];
const current = document.querySelector('#current-slide');
const progress = document.querySelector('#progress-bar');
let index = Math.max(0, slides.findIndex(slide => slide.id === location.hash.slice(1)));

function showSlide(nextIndex, updateHash = true) {
  index = (nextIndex + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  document.body.classList.toggle('dark-ui', [0, slides.length - 1].includes(index));
  current.textContent = String(index + 1).padStart(2, '0');
  progress.style.width = `${((index + 1) / slides.length) * 100}%`;
  if (updateHash) history.replaceState(null, '', `#${slides[index].id}`);
  document.title = `${slides[index].dataset.title} | Rede Climática Comunitária`;
}

document.querySelector('#prev').addEventListener('click', () => showSlide(index - 1));
document.querySelector('#next').addEventListener('click', () => showSlide(index + 1));
document.querySelector('#fullscreen').addEventListener('click', () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

document.addEventListener('keydown', event => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); showSlide(index + 1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); showSlide(index - 1); }
  if (event.key.toLowerCase() === 'f') document.querySelector('#fullscreen').click();
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});

let touchStart = 0;
document.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', event => {
  const distance = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(distance) > 55) showSlide(index + (distance < 0 ? 1 : -1));
}, { passive: true });

showSlide(index, false);
