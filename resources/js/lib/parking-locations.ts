import type { ParkingLocationDetails } from '@/types/location';

type ParkingLocationResponse = {
    data: ParkingLocationDetails;
};

export async function fetchParkingLocation(
    id: string,
    signal?: AbortSignal,
): Promise<ParkingLocationDetails> {
    const response = await fetch(
        `/parking-locations/${encodeURIComponent(id)}`,
        {
            headers: {
                Accept: 'application/json',
            },
            signal,
        },
    );

    if (!response.ok) {
        throw new Error('Failed to load parking location');
    }

    const data: ParkingLocationResponse = await response.json();

    return data.data;
}
