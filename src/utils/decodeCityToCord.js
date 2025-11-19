
/**
 * Decode city to latitude and longitude
 * @param {*} city {string}
 * @param {*} country {string}
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export async function decodeCityToCord(city, country) {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=no&country=${country}`);

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(`City "${city}" not found`);
    }

    const { latitude, longitude } = data.results[0];
    return { latitude, longitude };
}