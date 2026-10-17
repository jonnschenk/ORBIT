import {
  NASA_API_KEY, APOD_URL, IMAGES_URL, DETAIL_URL, APOD_PAGE, MAX_RESULTS
} from './config.js';

const http = axios.create({ timeout: 15000 });

const toHttps = (url) => (url ? url.replace(/^http:\/\//i, 'https://') : url);

// Some NASA descriptions include HTML markup; keep only the readable text.
const stripHtml = (html) => (html
  ? new DOMParser().parseFromString(html, 'text/html').body.textContent.replace(/\s+/g, ' ').trim()
  : '');

export async function getApod() {
  const { data } = await http.get(APOD_URL, {
    params: { api_key: NASA_API_KEY, thumbs: true }
  });

  const isVideo = data.media_type === 'video';
  return {
    id: 'apod',
    title: data.title,
    date: data.date,
    description: data.explanation,
    credit: data.copyright ? data.copyright.replace(/\s+/g, ' ').trim() : 'NASA / APOD',
    category: 'APOD',
    isVideo,
    image: toHttps(isVideo ? data.thumbnail_url : (data.hdurl || data.url)),
    thumb: toHttps(isVideo ? data.thumbnail_url : data.url),
    link: isVideo ? data.url : APOD_PAGE
  };
}

export async function searchImages(query) {
  const { data } = await http.get(`${IMAGES_URL}/search`, {
    params: { q: query, media_type: 'image' }
  });

  return data.collection.items
    .filter((item) => item.data?.length && item.links?.length)
    .slice(0, MAX_RESULTS)
    .map(normalizeItem);
}

export async function searchMany(queries, perQuery = 6) {
  const results = await Promise.all(
    queries.map(async (query) => (await searchImages(query)).slice(0, perQuery))
  );
  const seen = new Set();
  const interleaved = [];
  const maxResults = Math.max(0, ...results.map((items) => items.length));

  for (let index = 0; index < maxResults; index += 1) {
    results.forEach((items) => {
      const item = items[index];
      if (item && !seen.has(item.id)) {
        seen.add(item.id);
        interleaved.push(item);
      }
    });
  }

  return interleaved;
}

function normalizeItem(item) {
  const d = item.data[0];
  const thumb = toHttps(item.links[0].href);
  return {
    id: d.nasa_id,
    title: d.title,
    date: d.date_created,
    description: stripHtml(d.description),
    credit: d.photographer || d.secondary_creator || d.center || 'NASA',
    category: (d.keywords && d.keywords[0]) || 'NASA',
    thumb,
    image: thumb,
    link: `${DETAIL_URL}${encodeURIComponent(d.nasa_id)}`
  };
}

export async function getLargeImage(nasaId) {
  const { data } = await http.get(`${IMAGES_URL}/asset/${encodeURIComponent(nasaId)}`);
  const files = data.collection.items.map((i) => i.href);
  const pick =
    files.find((h) => /~large\.jpe?g$/i.test(h)) ||
    files.find((h) => /~medium\.jpe?g$/i.test(h)) ||
    files.find((h) => /\.jpe?g$/i.test(h));
  return toHttps(pick);
}
