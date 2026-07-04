// Google Places API (New, v1) helpers.

export interface PlaceDetails {
  rating: number | null;
  userRatingCount: number | null;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  userRatingCount: number | null;
}

function apiKey(): string {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set");
  return key;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey(),
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Place Details failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as { rating?: number; userRatingCount?: number };
  return {
    rating: data.rating ?? null,
    userRatingCount: data.userRatingCount ?? null,
  };
}

export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({ textQuery: query, maxResultCount: 8 }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Text Search failed (${res.status}): ${body.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    places?: Array<{
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      rating?: number;
      userRatingCount?: number;
    }>;
  };
  return (data.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName?.text ?? "(unnamed)",
    address: p.formattedAddress ?? "",
    rating: p.rating ?? null,
    userRatingCount: p.userRatingCount ?? null,
  }));
}
