const $ = (sel, root = document) => root.querySelector(sel);

export function formatDate(value) {
  if (!value) return 'Archive';
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T12:00:00` : value);
  if (Number.isNaN(date.getTime())) return 'Archive';
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

const panels = {
  loading: $('#state-loading'),
  results: $('#results'),
  empty: $('#state-empty'),
  error: $('#state-error')
};

export function showState(name) {
  Object.entries(panels).forEach(([key, el]) => { el.hidden = key !== name; });
}

export function setCount(text) {
  $('#count').textContent = text;
}

export function setEmptyQuery(query) {
  $('#empty-query').textContent = query;
}

export function renderCards(items, onOpen) {
  const template = $('#card-template');
  const list = $('#results');
  list.replaceChildren();

  items.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const img = $('.card__img', node);

    img.src = item.thumb.replace('~thumb', '~medium');
    img.addEventListener('error', () => { img.src = item.thumb; }, { once: true });
    img.alt = item.title;

    $('.card__cat', node).textContent = item.category;
    $('.card__title', node).textContent = item.title;
    $('.card__date', node).textContent = formatDate(item.date);
    $('.card', node).addEventListener('click', () => onOpen(item));

    list.append(node);
  });
}

export function renderApod(item) {
  const media = $('#apod-media');
  media.replaceChildren();
  $('#apod-error').hidden = true;
  $('#apod-open').hidden = false;

  if (item.image) {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title;
    img.loading = 'lazy';
    media.append(img);
  }

  const tag = document.createElement('span');
  tag.className = 'apod__badge glass';
  tag.textContent = item.isVideo ? 'APOD · VIDEO' : 'APOD';
  media.append(tag);

  $('#apod-date').textContent = formatDate(item.date);
  $('#apod-title').textContent = item.title;
  $('#apod-text').textContent = item.description.length > 360
    ? `${item.description.slice(0, 360).trim()}…`
    : item.description;
  $('#apod-credit').textContent = `Credit: ${item.credit}`;
  $('#apod-today').textContent = formatDate(item.date);
  $('#apod-open').disabled = false;
  $('#apod-grid').setAttribute('aria-busy', 'false');
}

export function renderApodError() {
  const media = $('#apod-media');
  media.replaceChildren();

  const img = document.createElement('img');
  img.src = 'assets/images/hero.jpg';
  img.alt = 'Illustration of a spiral galaxy';
  media.append(img);

  const badge = document.createElement('span');
  badge.className = 'apod__badge glass';
  badge.textContent = 'ORBIT · ILLUSTRATION';
  media.append(badge);

  $('#apod-date').textContent = '';
  $('#apod-title').textContent = 'Spiral Galaxy';
  $('#apod-text').textContent = 'A local illustration by ORBIT.';
  $('#apod-credit').textContent = 'Credit: Illustration by ORBIT';
  $('#apod-open').disabled = true;
  $('#apod-open').hidden = true;
  $('#apod-error').hidden = false;
  $('#apod-error').textContent = "NASA's Astronomy Picture of the Day is unavailable. Showing a local illustration instead.";
  $('#apod-grid').setAttribute('aria-busy', 'false');
}
