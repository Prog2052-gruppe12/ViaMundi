export function createWeatherPromt({ by, datoFra, datoTil, værdata }) {
  return `Oppsummer været for ${by ?? "destinasjonen"} fra ${datoFra ?? "start"} til ${datoTil ?? "slutt"}.

Du får et svar fra Open-Meteo API med disse nøklene:
- timezone (streng), timezone_abbreviation (streng), utc_offset_seconds (nummer)
- daily_units: enheter for hvert daglig felt
- daily: objekt med arrays av lik lengde for:
  - time (YYYY-MM-DD)
  - temperature_2m_min (°C), temperature_2m_max (°C)
  - precipitation_sum (mm)
  - precipitation_probability_max (%)
  - wind_speed_10m_max (m/s)
  - wind_gusts_10m_max (m/s)
  - weather_code (WMO-kode)

Returner KUN gyldig JSON (ingen kommentarer eller markdown).

Enheter og avrunding:
- Temperatur: °C, nærmeste heltall
- Nedbør: mm, 1 desimal
- Sjanser: %, nærmeste heltall
- Vind: m/s, 1 desimal
- Datoformat: YYYY-MM-DD

Regler for korthet:
- "summary": Maks 30 ord. Bruk enkelt reisespråk på norsk bokmål. Prioriter: vått/tørt → temperatur → vind.
- "summaryOfTheDay": Maks 30 ord på norsk bokmål. Bruk frasereglene under.

Fraseregler for summaryOfTheDay (bruk kun oppgitte felter):
- Fuktighet fra nedbør + sannsynlighet:
  - "Tørt" (nedbør = 0 OG sannsynlighet < 30)
  - "Mulighet for byger" (sannsynlighet 30–59 OG nedbør < 5)
  - "Bygevær" (sannsynlighet 60–79 ELLER nedbør 1–4.9)
  - "Regn" (sannsynlighet ≥ 80 ELLER nedbør ≥ 5)
- Temperaturfølelse fra t_max_c:
  - ≤5 = "kaldt", 6–12 = "kjølig", 13–20 = "mildt", ≥21 = "varmt"
- Vind fra vindkast maks (bruk vindstyrke maks hvis kast mangler):
  - <8 = utelat vindbeskrivelse, 8–12.9 = "frisk bris", ≥13 = "vindfullt"
- Format: <Fuktighet>. <Temperaturfølelse> [temp°C]. [Vind]. (utelat manglende deler)

Skjema:
{
  "summary": "streng, maks 30 ord PÅ NORSK",
  "days": [{
    "summaryOfTheDay": "streng, maks 30 ord på NORSK",
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

Validering og robust feilbehandling:
1) Hvis "daily" eller påkrevde arrays mangler, returner:
   {"summary":"","days":[],"meta":{...},"error":true,"errors":[{"code":"MISSING_FIELD","path":"daily.<navn>","message":"Mangler påkrevd felt"}]}
2) Hvis arrays har ulik lengde, returner feil:
   {"code":"LENGTH_MISMATCH","path":"daily","message":"Alle daily-arrays må ha lik lengde"}
3) Hvis noen verdier i daily.time ikke er gyldige datoer, returner:
   {"code":"INVALID_DATE","path":"daily.time[i]","message":"Ugyldig datoformat; forventet YYYY-MM-DD"}
4) Hvis verdier ikke er numeriske hvor det er forventet tall, sett til null og legg til advarsel:
   {"code":"NON_NUMERIC","path":"daily.<navn>[i]","message":"Forventet tall; satt til null"}
   Fortsett med gjenværende gyldige rader.
5) Hvis ingen gyldige rader gjenstår, returner:
   {"summary":"","days":[],"meta":{...},"error":true,"errors":[{"code":"NO_DATA","path":"daily","message":"Ingen gyldige daglige rader"}]}
6) Inkluder kun datoer innenfor [${datoFra ?? "start"}..${datoTil ?? "slutt"}] (inkludert). Andre ignoreres med advarsel:
   {"code":"OUT_OF_RANGE","path":"daily.time[i]","message":"Dato utenfor forespurt periode; ignorert"}

Mapping:
- Input → Output (per dag):
  time → date
  temperature_2m_min → t_min_c (avrundet til 0)
  temperature_2m_max → t_max_c (avrundet til 0)
  precipitation_sum → precip_mm (1 desimal)
  precipitation_probability_max → pop_max_pct (0 desimaler)
  wind_gusts_10m_max → wind_gust_max_ms (1 desimal)
  wind_speed_10m_max → wind_speed_max_ms (1 desimal)
  weather_code → weather_code

Hvis et påkrevd felt mangler for en dag, sett verdien til null for den dagen (ikke fjern dagen).

Værdata:
${JSON.stringify(værdata)}`;
}
