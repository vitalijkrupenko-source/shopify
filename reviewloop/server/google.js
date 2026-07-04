// Google integration:
//  - build the direct "write a review" deep link from a Place ID
//  - (optional, needs GOOGLE_MAPS_API_KEY) resolve a Place ID from a
//    business name/address, and poll live rating + review counts so the
//    dashboard can show reviews actually gained.

export function reviewUrl(placeId) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

const KEY = () => process.env.GOOGLE_MAPS_API_KEY;

export function placesEnabled() {
  return Boolean(KEY());
}

// Find a Place ID from free text like "Joe's Pizza, 7 Carmine St, New York".
export async function findPlace(query) {
  if (!KEY()) return null;
  const url =
    'https://maps.googleapis.com/maps/api/place/findplacefromtext/json' +
    `?input=${encodeURIComponent(query)}&inputtype=textquery` +
    `&fields=place_id,name,formatted_address,rating,user_ratings_total&key=${KEY()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places API ${res.status}`);
  const json = await res.json();
  return json.candidates?.[0] ?? null;
}

// Fetch the current rating and total review count for a Place ID.
export async function fetchRating(placeId) {
  if (!KEY()) return null;
  const url =
    'https://maps.googleapis.com/maps/api/place/details/json' +
    `?place_id=${encodeURIComponent(placeId)}&fields=rating,user_ratings_total&key=${KEY()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Places API ${res.status}`);
  const json = await res.json();
  const r = json.result;
  if (!r) return null;
  return { rating: r.rating ?? null, total: r.user_ratings_total ?? 0 };
}
