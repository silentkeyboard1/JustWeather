import type { City } from '../model/city';

type OpenMeteoGeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

export async function searchCities(
  searchTerm: string
): Promise<City[]> {
  const trimmedSearchTerm =
    searchTerm.trim();

  if (!trimmedSearchTerm) {
    return [];
  }

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=${encodeURIComponent(
        trimmedSearchTerm
      )}` +
      `&count=5` +
      `&language=en` +
      `&format=json`
  );

  if (!response.ok) {
    throw new Error(
      'Failed to load cities.'
    );
  }

  const data =
    (await response.json()) as OpenMeteoGeocodingResponse;

  return (
    data.results ?? []
  ).map((result) => ({
    id: String(result.id),

    name: result.name,

    country:
      result.country ??
      'Unknown',

    region:
      result.admin1,

    latitude:
      result.latitude,

    longitude:
      result.longitude,
  }));
}