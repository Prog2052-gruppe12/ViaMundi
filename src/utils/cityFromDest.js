export function getCityName(destination) {
    const city = destination.split(",")[1];
    return city.trim()
}