// Helpers for the Map Pin gift.
//
// A saved place looks like { label, name, area, lat, lon, zoom }. Gifts made before
// the redesign only have { label, lat, lon }, so everything here falls back for those.

export function placeName(place) {
  return place.name || place.label;
}

// Opens the place in Google Maps: by name and area when we have them (so it lands on the
// real place), otherwise by coordinates.
export function googleMapsUrl(place) {
  const query =
    place.name && place.area ? `${place.name}, ${place.area}` : `${place.lat},${place.lon}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// Turns a Nominatim search result into { name, area }: "Blue Bottle Coffee" / "Oakland, California".
export function shortName(result) {
  const a = result.address ?? {};
  const street = [a.house_number, a.road].filter(Boolean).join(' ');
  const name = result.name || street || result.display_name.split(',')[0];
  const town = a.city || a.town || a.village || a.hamlet || a.suburb || a.county;
  const region = a.state || a.region || a.country;
  const area = [town, region].filter((part) => part && part !== name).join(', ');
  return { name, area: area || a.country || '' };
}

// Picks a zoom level that fits the place: close in on a café, further out for a city.
export function zoomFor(result) {
  const [south, north, west, east] = result.boundingbox.map(Number);
  const span = Math.max(north - south, east - west, 0.002);
  return Math.round(Math.min(16, Math.max(3, Math.log2(360 / span) - 1)));
}
