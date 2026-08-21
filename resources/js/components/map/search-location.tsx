import { router } from '@inertiajs/react';
import { Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
        <div className="relative h-fit w-full">
            {/* Search Input Bar */}
            <div className="group ring-border relative w-full rounded-2xl bg-background/60 p-1.5 shadow-lg ring-1 shadow-black/5 backdrop-blur-md transition-all duration-200 focus-within:ring-2 focus-within:ring-primary">
                <div className="flex w-full gap-2">
                    <InputGroup className="border-0 bg-transparent shadow-none focus-within:ring-0">
                        <InputGroupAddon align="inline-start" className="pl-3">
                            <MapPin className="size-5 shrink-0 text-primary transition-colors group-focus-within:text-primary" />
                        </InputGroupAddon>

                        <InputGroupInput
                            id="location"
                            value={query}
                            onChange={(event) => {
                                const value = event.target.value;
                                setQuery(value);

                                if (value.trim().length < 2) {
                                    setSuggestions([]);
                                }
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
                            className="placeholder:text-muted-foreground h-12 w-full border-0 bg-transparent text-base focus-visible:ring-0 sm:text-sm"
                            placeholder="Where are you going?"
                            autoComplete="off"
                        />

                        {/* Inline Loading Feedback */}
                        {isLoading && (
                            <InputGroupAddon
                                align="inline-end"
                                className="pr-3"
                            >
                                <Loader2 className="text-muted-foreground size-4 animate-spin" />
                            </InputGroupAddon>
                        )}
                    </InputGroup>
                    {/* 
                    <Button
                        type="button"
                        onClick={handleSearch}
                        size="icon"
                        className="text-primary-foreground size-11 shrink-0 rounded-xl bg-primary shadow-sm transition-transform active:scale-95"
                        disabled={isLoading || suggestions.length === 0}
                    >
                        <ArrowRight className="size-5" />
                        <span className="sr-only">Search</span>
                    </Button> */}
                </div>
            </div>

            {/* Suggestions Overlay Dropdown */}
            {isFocused && suggestions.length > 0 && (
                <div className="border-border text-popover-foreground absolute top-full right-0 left-0 z-50 mt-1 max-h-[40dvh] overflow-y-scroll overscroll-contain rounded-md border bg-background/60 p-1 shadow-2xl backdrop-blur-md lg:max-h-[30dvh]">
                    <div>
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
                                className="group hover:bg-accent/60 active:bg-accent focus:bg-accent hover:bg-accent flex min-h-[56px] w-full cursor-pointer items-start gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors hover:text-primary focus:outline-none"
                            >
                                <div className="bg-accent mt-0.5 rounded-full p-2 group-hover:bg-background group-hover:text-primary">
                                    <MapPin className="text-muted-foreground size-4 shrink-0 group-hover:text-primary" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-foreground truncate text-sm font-semibold">
                                            {location.name}
                                        </p>

                                        {location.source === 'database' && (
                                            <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20 ring-inset">
                                                ParkFinder
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs">
                                        {location.formatted}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading Indicator Fallback overlay */}
            {isFocused &&
                isLoading &&
                query.trim().length >= 2 &&
                suggestions.length === 0 && (
                    <div className="border-border text-muted-foreground absolute top-full right-0 left-0 z-50 mt-1 flex items-center justify-center gap-2.5 rounded-2xl border bg-background/60 px-4 py-4 text-sm shadow-xl backdrop-blur-md">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span>Searching locations...</span>
                    </div>
                )}
        </div>
    );
}
