import type { LocationSuggestion } from '@/types/location';

type LocationSearchResponse = {
    data: LocationSuggestion[];
};

export async function searchLocations(
    query: string,
): Promise<LocationSuggestion[]> {
    const response = await fetch(
        `/location-search?q=${encodeURIComponent(query)}`,
        {
            headers: {
                Accept: 'application/json',
            },
        },
    );

    if (!response.ok) {
        throw new Error('Location search failed');
    }

    const data: LocationSearchResponse = await response.json();

    return data.data;
}
