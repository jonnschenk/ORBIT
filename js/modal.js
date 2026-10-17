import { getLargeImage } from './api.js';
import { formatDate } from './ui.js';

const dialog = document.querySelector('#modal');
const img = document.querySelector('#modal-img');
let lastFocused = null;
let openToken = 0;

export function openModal(item) {
  const token = ++openToken;
  lastFocused = document.activeElement;

  document.querySelector('#modal-cat').textContent = item.category;
  document.querySelector('#modal-date').textContent = formatDate(item.date);
  document.querySelector('#modal-title').textContent = item.title;
  document.querySelector('#modal-desc').textContent = item.description || 'No description available.';
  document.querySelector('#modal-credit').textContent = item.credit;
  document.querySelector('#modal-link').href = item.link;

  img.alt = item.title;
  img.src = item.image || item.thumb;
  img.classList.remove('is-ready');

  if (!dialog.open) dialog.showModal();
  document.body.classList.add('is-locked');

  if (item.id !== 'apod') {
    getLargeImage(item.id)
      .then((url) => { if (url && token === openToken) img.src = url; })
      .catch(() => {});
  }
}

export function closeModal() {
  if (dialog.open) dialog.close();
}

export function initModal() {
  document.querySelector('#modal-close').addEventListener('click', closeModal);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal();
  });

  img.addEventListener('load', () => img.classList.add('is-ready'));

  dialog.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    openToken += 1;
    lastFocused?.focus?.();
  });
}
