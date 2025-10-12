/**
 * Decode city to latitude and longitude
 * @param {string} city - City name to decode
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function decodeCityToCoord(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5&language=en`
  );
  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${city}" not found`);
  }

  const { latitude, longitude } = data.results[0];
  return { latitude, longitude };
}

