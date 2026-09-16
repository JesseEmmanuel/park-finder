export type LocationSuggestion = {
    id: string;
    name: string;
    formatted: string;
    lat: number;
    lon: number;
    source: 'database' | 'geoapify';
};

export type ParkingLocation = {
    id: string;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    opening_time: string;
    closing_time: string;
    types: string;
    approximate_address: string;
    estimated_price: string;
    distance: number;
};
