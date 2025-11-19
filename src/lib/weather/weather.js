const daily_forecast = [
  'temperature_2m_min',
  'temperature_2m_max',
  'precipitation_sum',
  'precipitation_probability_max', 
  'wind_speed_10m_max',
  'wind_gusts_10m_max',            
  'weather_code'                 
].join(',');

export async function fetchWeather({ latitude, longitude, dateFrom, dateTo }) {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      start_date: dateFrom,
      end_date: dateTo,
      daily: daily_forecast,
      timezone: 'auto',
      precipitation_unit: 'mm',
      wind_speed_unit: 'ms',
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    console.log('Fetching weather from:', url);

    const res = await fetch(url);
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Open-Meteo HTTP error:', res.status, errorData);
      throw new Error(`Open-Meteo API error: ${errorData.reason || errorData.error || 'Unknown error'}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Error fetching weather:', err);
    throw err;
  }
}