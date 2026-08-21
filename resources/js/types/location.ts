export type LocationSuggestion = {
    id: string;
    name: string;
    formatted: string;
    lat: number;
    lon: number;
    source: 'database' | 'geoapify';
};
