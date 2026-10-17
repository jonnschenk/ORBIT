import { getApod, searchImages, searchMany } from './api.js';
import { ALL_QUERIES, DEFAULT_QUERY } from './config.js';
import {
  showState, setCount, setEmptyQuery, renderCards, renderApod, renderApodError
} from './ui.js';
import { initModal, openModal } from './modal.js';

const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const chips = document.querySelectorAll('.chip');

let currentQuery = DEFAULT_QUERY;
let requestId = 0;

async function runSearch(query) {
  const id = ++requestId;
  currentQuery = query;
  showState('loading');
  setCount('');

  try {
    const items = query === DEFAULT_QUERY
      ? await searchMany(ALL_QUERIES)
      : await searchImages(query);
    if (id !== requestId) return;

    if (!items.length) {
      setEmptyQuery(query);
      setCount('0 images');
      showState('empty');
      return;
    }

    renderCards(items, openModal);
    setCount(`${items.length} ${items.length === 1 ? 'image' : 'images'}`);
    showState('results');
  } catch (error) {
    if (id !== requestId) return;
    console.error('[ORBIT] Error searching images:', error);
    setCount('');
    showState('error');
  }
}

function setActiveChip(button) {
  chips.forEach((chip) => {
    const active = chip === button;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) { input.focus(); return; }
  setActiveChip(null);
  runSearch(query);
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    setActiveChip(chip);
    input.value = '';
    runSearch(chip.dataset.query);
  });
});

document.querySelector('#retry-search').addEventListener('click', () => runSearch(currentQuery));
document.querySelector('#reset-search').addEventListener('click', () => {
  input.value = '';
  setActiveChip(chips[0]);
  runSearch(DEFAULT_QUERY);
});

async function loadApod() {
  try {
    const apod = await getApod();
    renderApod(apod);
    document.querySelector('#apod-open').addEventListener('click', () => openModal(apod));
  } catch (error) {
    console.error('[ORBIT] Error loading APOD:', error);
    renderApodError();
  }
}

function initNavigation() {
  const sections = document.querySelectorAll('main section[data-index]');
  const links = document.querySelectorAll('.nav__link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        const active = link.dataset.section === entry.target.id;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));

  const toggle = document.querySelector('#menu-toggle');
  const nav = document.querySelector('#nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

document.querySelector('#year').textContent = new Date().getFullYear();
initModal();
initNavigation();
initReveal();
loadApod();
runSearch(DEFAULT_QUERY);
