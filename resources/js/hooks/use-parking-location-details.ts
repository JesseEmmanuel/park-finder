import { useCallback, useEffect, useState } from 'react';

import { fetchParkingLocation } from '@/lib/parking-locations';
import type { ParkingLocationDetails } from '@/types/location';

type Result = {
    key: string;
    data: ParkingLocationDetails | null;
    error: boolean;
};

/**
 * Loads a parking location's full details. Loading state is derived from
 * whether the stored result belongs to the current request, so switching
 * locations never flashes stale data.
 */
export function useParkingLocationDetails(id: string | null) {
    const [attempt, setAttempt] = useState(0);
    const [result, setResult] = useState<Result | null>(null);

    const requestKey = id ? `${id}:${attempt}` : null;

    useEffect(() => {
        if (!id || !requestKey) {
            return;
        }

        const controller = new AbortController();

        fetchParkingLocation(id, controller.signal)
            .then((data) => {
                setResult({ key: requestKey, data, error: false });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(error);
                setResult({ key: requestKey, data: null, error: true });
            });

        return () => controller.abort();
    }, [id, requestKey]);

    const retry = useCallback(() => setAttempt((value) => value + 1), []);

    const current = result && result.key === requestKey ? result : null;

    return {
        details: current?.data ?? null,
        isLoading: requestKey !== null && current === null,
        isError: current?.error ?? false,
        retry,
    };
}
