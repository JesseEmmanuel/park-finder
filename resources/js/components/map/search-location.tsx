import { router } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';

import { searchLocations } from '@/lib/location-search';
import type { LocationSuggestion } from '@/types/location';

export default function SearchLocation() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (trimmedQuery.length < 2) {
            return;
        }

        searchTimeout.current = setTimeout(async () => {
            try {
                setIsLoading(true);

                const results = await searchLocations(trimmedQuery);

                setSuggestions(results);
            } catch (error) {
                console.error('Location autocomplete failed:', error);

                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, [query]);

    const handleSelect = (location: LocationSuggestion) => {
        setQuery(location.formatted);
        setSuggestions([]);
        setIsFocused(false);

        router.visit(
            `/driver/map?lat=${location.lat}&lon=${location.lon}&zoom=14`,
        );
    };

    const handleSearch = () => {
        const location = suggestions[0];

        if (location) {
            handleSelect(location);
        }
    };

    return (
        <div className="relative w-full max-w-2xl">
            <div className="flex w-full flex-col gap-2 rounded-md bg-white p-2 shadow-md">
                <div className="flex gap-2 lg:flex-row">
                    <InputGroup>
                        <InputGroupInput
                            id="location"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                            }}
                            onFocus={() => {
                                setIsFocused(true);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleSearch();
                                }

                                if (event.key === 'Escape') {
                                    setSuggestions([]);
                                    setIsFocused(false);
                                }
                            }}
                            className="rounded-sm"
                            placeholder="Where are you going?"
                            autoComplete="off"
                        />

                        <InputGroupAddon align="inline-start">
                            <MapPin className="text-muted-foreground text-primary" />
                        </InputGroupAddon>
                    </InputGroup>

                    <Button
                        type="button"
                        onClick={handleSearch}
                        className="w-[75px] rounded-md text-white"
                        disabled={isLoading}
                    >
                        <ArrowRight className="text-white" />
                    </Button>
                </div>
            </div>

            {isFocused && suggestions.length > 0 && (
                <div className="absolute top-15 right-0 left-0 z-50 mt-2 overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest shadow-lg lg:right-[34%]">
                    {suggestions.map((location, index) => (
                        <button
                            key={`${location.lat}-${location.lon}-${index}`}
                            type="button"
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}
                            onClick={() => {
                                handleSelect(location);
                            }}
                            className="flex min-h-16 w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-container focus:bg-surface-container"
                        >
                            <MapPin className="mt-0.5 size-5 shrink-0 text-secondary" />

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-semibold text-on-surface">
                                        {location.name}
                                    </p>

                                    {location.source === 'database' && (
                                        <span className="shrink-0 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                            ParkFinder
                                        </span>
                                    )}
                                </div>

                                <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                                    {location.formatted}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isFocused && isLoading && query.trim().length >= 2 && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface-variant shadow-lg lg:right-[34%]">
                    Searching locations...
                </div>
            )}
        </div>
    );
}
