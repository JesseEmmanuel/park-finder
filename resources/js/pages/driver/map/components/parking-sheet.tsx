import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { MockParkingLot } from '@/data/mock-parking';


interface ParkingSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    radius: number;
    onRadiusChange: (radius: number) => void;
    parkingLots: MockParkingLot[];
}

const radiusOptions = [
    { label: '250m', value: 250 },
    { label: '500m', value: 500 },
    { label: '1km', value: 1000 },
    { label: '2km', value: 2000 },
];

export default function ParkingSheet({
    open,
    onOpenChange,
    radius,
    onRadiusChange,
    parkingLots,
}: ParkingSheetProps) {
    const filteredParkingLots = parkingLots
        .filter((parkingLot) => parkingLot.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="bottom"
                className="rounded-t-xl border-t border-outline-variant bg-surface-container-lowest p-0 text-on-surface shadow-2xl"
            >
                <div className="mx-auto w-full max-w-3xl">
                    <SheetHeader className="relative px-4 pb-2 pt-5">
                        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-outline-variant" />

                        <SheetTitle className="text-headline-md text-primary">
                            Available parking
                        </SheetTitle>

                        <SheetClose asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-3 top-3 size-10 rounded-full text-on-surface-variant hover:bg-surface-container"
                            >
                                <span className="sr-only">
                                    Close parking results
                                </span>
                            </Button>
                        </SheetClose>
                    </SheetHeader>

                    <div className="px-4 pb-6">
                        {/* Radius selector */}
                        <div className="grid grid-cols-4 gap-2">
                            {radiusOptions.map((option) => {
                                const selected =
                                    radius === option.value;

                                return (
                                    <Button
                                        key={option.value}
                                        type="button"
                                        variant={
                                            selected
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            onRadiusChange(option.value)
                                        }
                                        className={
                                            selected
                                                ? 'min-h-12 rounded-md bg-primary text-on-primary'
                                                : 'min-h-12 rounded-md border-outline-variant bg-surface text-primary'
                                        }
                                    >
                                        {option.label}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Results */}
                        <div className="mt-5 max-h-[55vh] overflow-y-auto">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-label-bold text-on-surface-variant">
                                    {filteredParkingLots.length}{' '}
                                    {filteredParkingLots.length === 1
                                        ? 'location'
                                        : 'locations'}{' '}
                                    found
                                </p>

                                <p className="text-label-sm text-on-surface-variant">
                                    Within{' '}
                                    {radius >= 1000
                                        ? `${radius / 1000}km`
                                        : `${radius}m`}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {filteredParkingLots.length > 0 ? (
                                    filteredParkingLots.map(
                                        (parkingLot) => (
                                            <button
                                                key={parkingLot.id}
                                                type="button"
                                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest p-4 text-left transition-colors hover:bg-surface-container focus-visible:bg-surface-container"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <h3 className="text-body-lg font-semibold text-on-surface">
                                                            {
                                                                parkingLot.name
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-body-md text-on-surface-variant">
                                                            {
                                                                parkingLot.address
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="shrink-0 text-right">
                                                        <p className="text-label-bold text-primary">
                                                            {
                                                                parkingLot.distance
                                                            }
                                                            m
                                                        </p>

                                                        <p className="mt-1 text-label-sm text-on-surface-variant">
                                                            {
                                                                parkingLot.price
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2">
                                                    <MapPin className="size-4 text-secondary" />

                                                    <span
                                                        className={
                                                            parkingLot.status ===
                                                                'recent'
                                                                ? 'rounded-full bg-parking-blue-light px-2.5 py-1 text-label-sm text-parking-reported-text'
                                                                : 'rounded-full bg-parking-historical-bg px-2.5 py-1 text-label-sm text-parking-historical-text'
                                                        }
                                                    >
                                                        {parkingLot.status ===
                                                            'recent'
                                                            ? 'Recently Reported'
                                                            : 'Historical Spot'}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    )
                                ) : (
                                    <div className="py-10 text-center">
                                        <p className="text-body-md text-on-surface-variant">
                                            No parking locations found
                                            within this radius.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}