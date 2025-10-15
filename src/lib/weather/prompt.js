export function createWeatherPrompt({ city, dateFrom, dateTo, weatherData }) {
    return `Summarize weather for ${city ?? "the destination"} from ${dateFrom ?? "start"} to ${dateTo ?? "end"}.
  
  You are given an Open-Meteo API response with these keys:
  - timezone (string), timezone_abbreviation (string), utc_offset_seconds (number)
  - daily_units: units for each daily field
  - daily: object with arrays of equal length for:
    - time (YYYY-MM-DD)
    - temperature_2m_min (°C), temperature_2m_max (°C)
    - precipitation_sum (mm)
    - precipitation_probability_max (%)
    - wind_speed_10m_max (m/s)
    - wind_gusts_10m_max (m/s)
    - weather_code (WMO code)
  
  Output ONLY valid JSON (no comments/markdown).
  
  Units & rounding:
  - Temperatures: °C, nearest integer
  - Precipitation: mm, 1 decimal
  - Probabilities: %, nearest integer
  - Wind: m/s, 1 decimal
  - Dates YYYY-MM-DD
  
  Brevity rules:
  - "summary": ≤30 words. Simple travel language Norwegian Bokmål. Prioritize: wet/dry → temp → wind.
  - "summaryOfTheDay": ≤30 words in Norwegian Bokmål. Use phrase rules below.
  
  Phrase rules for summaryOfTheDay (use only provided fields):
  - Wetness from precip + pop:
    - "Dry" (precip_mm = 0 AND pop_max_pct < 30)
    - "Chance of showers" (pop_max_pct 30–59 AND precip_mm < 5)
    - "Showery" (pop_max_pct 60–79 OR precip_mm 1–4.9)
    - "Rainy" (pop_max_pct ≥ 80 OR precip_mm ≥ 5)
  - Temp feel from t_max_c:
    - ≤5 = "cold", 6–12 = "cool", 13–20 = "mild", ≥21 = "warm"
  - Wind from wind_gust_max_ms (fallback to wind_speed_max_ms if gusts missing):
    - <8 = omit wind word, 8–12.9 = "breezy", ≥13 = "windy"
  - Format: <Wetness>. <Temp feel> [temp°C]. [Wind].  (omit any missing parts)
  
  Schema:
  {
    "summary": "string 30 words IN NO ",
    "days": [{
      "summaryOfTheDay": "string 30 words in NO",
      "date": "YYYY-MM-DD",
      "t_min_c": number | null,
      "t_max_c": number | null,
      "precip_mm": number | null,
      "pop_max_pct": number | null,
      "wind_gust_max_ms": number | null,
      "wind_speed_max_ms": number | null,
      "weather_code": number | null
    }],
    "meta": {
      "timezone": "string" | null,
      "timezone_abbreviation": "string" | null,
      "utc_offset_seconds": number | null
    },
    "error": boolean,
    "errors": [{
      "code": "string",
      "path": "string",
      "message": "string"
    }] | []
  }
  
  Validation & robust error handling rules:
  1) If daily or any required array is missing, return:
     {"summary":"","days":[],"meta":{...},"error":true,"errors":[{"code":"MISSING_FIELD","path":"daily.<name>","message":"Missing required field"}]}
  2) If arrays differ in length, return error:
     {"code":"LENGTH_MISMATCH","path":"daily","message":"All daily arrays must have equal length"}
  3) If any non-date value appears in daily.time, return error:
     {"code":"INVALID_DATE","path":"daily.time[i]","message":"Invalid date format; expected YYYY-MM-DD"}
  4) If values are non-numeric where numeric expected, coerce to null and add a warning:
     {"code":"NON_NUMERIC","path":"daily.<name>[i]","message":"Expected number; coerced to null"}
     Continue with remaining valid rows.
  5) If no valid rows remain, return:
     {"summary":"","days":[],"meta":{...},"error":true,"errors":[{"code":"NO_DATA","path":"daily","message":"No valid daily rows"}]}
  6) Only include dates that fall within the [${dateFrom ?? "start"}..${dateTo ?? "end"}] range (inclusive). Others are ignored with warning:
     {"code":"OUT_OF_RANGE","path":"daily.time[i]","message":"Date outside requested range; ignored"}
  
  Mapping:
  - Input → Output (per day):
    time → date
    temperature_2m_min → t_min_c (rounded 0)
    temperature_2m_max → t_max_c (rounded 0)
    precipitation_sum → precip_mm (1 decimal)
    precipitation_probability_max → pop_max_pct (0 decimals)
    wind_gusts_10m_max → wind_gust_max_ms (1 decimal)
    wind_speed_10m_max → wind_speed_max_ms (1 decimal)
    weather_code → weather_code
  
  If any required value is missing for a day, set that field to null for that day (do not drop the day).
  
  Weather data:
  ${JSON.stringify(weatherData)}`;
  }
  