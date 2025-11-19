import { CloudSun, CloudDrizzle, CloudSnow, CloudLightning, Snowflake, CloudRain, CloudHail, CloudFog, Sun } from "lucide-react";

export function getWeatherIcon(weatherCode, size) {
    const code = Number(weatherCode);
    if (Number.isNaN(code)) return <Sun size={size}/>;

    switch (code) {
        case 0:
            return <Sun size={size}/>;
        case 1:
        case 2:
        case 3:
            return <CloudSun size={size}/>;
        case 45:
        case 48:
            return <CloudFog size={size}/>;
        case 51:
        case 53:
        case 55:
            return <CloudDrizzle size={size}/>;
        case 56:
        case 57:
        case 66:
        case 67:
            return <CloudHail size={size}/>;
        case 61:
        case 63:
        case 65:
        case 80:
        case 81:
        case 82:
            return <CloudRain size={size}/>;
        case 71:
        case 73:
        case 75:
        case 85:
        case 86:
            return <CloudSnow size={size}/>;
        case 77:
            return <Snowflake size={size}/>;
        case 95:
        case 96:
        case 99:
            return <CloudLightning size={size}/>;
        default:
            return <Sun size={size}/>;
    }
}