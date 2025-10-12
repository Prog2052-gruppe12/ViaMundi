import cities from "@/assets/cities.json";

/**
 * Check if a city is valid
 * @param {string} city - The city to check
 * @returns {boolean} True if the city is valid, false otherwise
 */
export function cityIsValid(city) {
  if (!city) return false;

  const lowerCity = city.toLowerCase();

  return Object.values(cities).some(countryCities =>
    countryCities.some(c => c.toLowerCase() === lowerCity)
  );
}
