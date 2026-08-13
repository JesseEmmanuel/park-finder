export interface GeoapifyLocation {
    lat: number;
    lon: number;
    formatted: string;
    name?: string;
    city?: string;
    country?: string;
}

interface GeoapifyAutocompleteResponse {
    results?: GeoapifyLocation[];
}

export async function autocompleteLocation(
    text: string
): Promise<GeoapifyLocation[]> {
    const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error(
            'VITE_GEOAPIFY_API_KEY is not defined.'
        );
    }

    const params = new URLSearchParams({
        text,
        format: 'json',
        limit: '5',
        filter: 'countrycode:ph',
        apiKey,
    });

    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`
    );

    if (!response.ok) {
        throw new Error(
            `Geoapify request failed: ${response.status}`
        );
    }

    const data: GeoapifyAutocompleteResponse =
        await response.json();

    return data.results ?? [];
}