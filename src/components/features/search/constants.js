import citiesData from "@/assets/cities.json";

export const tripTypes = [
    { label: "Syden", value: "syden" },
    { label: "Storbyferie", value: "storby" },
    { label: "Skiferie", value: "ski" },
    { label: "Eksotisk", value: "eksotisk" },
];

export const allOptions = [
    {
        group: "Reisetype",
        items: tripTypes,
    },
    {
        group: "Sted",
        items: Object.entries(citiesData).flatMap(([land, byer]) =>
            byer.map((by) => ({
                label: `${land}, ${by}`,
                value: by,
            }))
        ),
    },
];
