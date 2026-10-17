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

export type ParkingLocationType =
    'LOT' | 'STREET_SIDE' | 'PAID_YARD' | 'COMPOUND';

export type ParkingLocationImage = {
    id: string;
    url: string;
};

export type ParkingLocationDetails = {
    id: string;
    name: string;
    description: string;
    approximate_address: string;
    latitude: number;
    longitude: number;
    opening_time: string;
    closing_time: string;
    types: ParkingLocationType;
    estimated_price: string;
    source: string;
    updated_at: string | null;
    images: ParkingLocationImage[];
};
