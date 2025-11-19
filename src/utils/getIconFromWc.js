import { CloudSun } from "lucide-react";
import { CloudDrizzle } from "lucide-react";
import { CloudSnow } from "lucide-react";
import { CloudLightning } from "lucide-react";
import { Snowflake } from "lucide-react";
import { CloudRain } from "lucide-react";
import { CloudHail } from "lucide-react";
import { CloudFog } from "lucide-react";
import { Sun } from "lucide-react";

export function getWeatherIcon(weatherCode) {
    let icon = null;

    switch (weatherCode) {
        case 0:
            icon = <Sun />;
            break;
        case 1, 2, 3:
            icon = <CloudSun />;
            break;
        case 45, 48:
            icon = <CloudFog />;
            break;
        case 51, 53, 55:
            icon = <CloudDrizzle />;
            break;
        case 56, 57, 66, 67:
            icon = <CloudHail />;
            break;
        case 61, 63, 65, 80, 81, 82:
            icon = <CloudRain />;
            break;
        case 71, 73, 75, 85, 86:
            icon = <CloudSnow />;
            break;
        case 77:
            icon = <Snowflake />;
            break;
        case 95, 96, 99:
            icon = <CloudLightning />;
            break;
        default:
            break;
    }

    return icon;
}