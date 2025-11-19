import { CloudSun } from "lucide-react";
import { CloudDrizzle } from "lucide-react";
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
        case 61, 63, 65:
            icon = <CloudRain />;
            break;
        case 51, 53, 55:
            icon = <CloudDrizzle />;
            break;
        case 51, 53, 55:
            icon = <CloudDrizzle />;
            break;
        default:
            break;
    }
}