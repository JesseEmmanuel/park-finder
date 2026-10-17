import {
    Banknote,
    CalendarCheck,
    Check,
    Clock,
    Info,
    MapPin,
    Navigation,
    Map as MapIcon,
    Share2,
    SquareParking,
    Tag,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { useParkingLocationDetails } from '@/hooks/use-parking-location-details';
import type {
    ParkingLocation,
    ParkingLocationDetails,
    ParkingLocationType,
} from '@/types/location';
import ParkingImageGallery from './parking-image-gallery';

interface ParkingDetailModalProps {
    parkingLot: ParkingLocation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onViewOnMap: (parkingLot: ParkingLocation) => void;
}

const typeLabels: Record<ParkingLocationType, string> = {
    LOT: 'Parking Lot',
    STREET_SIDE: 'Street Side',
    PAID_YARD: 'Paid Yard',
    COMPOUND: 'Compound',
};

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
});

function formatDistance(meters: number): string {
    if (!Number.isFinite(meters)) {
        return '';
    }

    return meters >= 1000
        ? `${(meters / 1000).toFixed(1)} km away`
        : `${Math.round(meters)} m away`;
}

/** Converts "100 PHP" into "₱100"; anything unrecognised is shown as-is. */
function formatPrice(price: string): string {
    const match = price.trim().match(/^(\d+(?:\.\d+)?)\s*(?:PHP|₱)?$/i);

    return match ? `₱${match[1]}` : price;
}

function getPriceLabel(price: string): 'Paid' | 'Free' | null {
    const normalized = price.trim().toLowerCase();

    if (normalized === 'free') {
        return 'Free';
    }

    const amount = Number.parseFloat(normalized.replace(/[^\d.]/g, ''));

    if (!Number.isFinite(amount)) {
        return null;
    }

    return amount > 0 ? 'Paid' : 'Free';
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

function getMapsCoordinates(parkingLot: ParkingLocation): string {
    return `${Number(parkingLot.latitude)},${Number(parkingLot.longitude)}`;
}

function getDirectionsUrl(parkingLot: ParkingLocation): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${getMapsCoordinates(parkingLot)}`;
}

function getShareUrl(parkingLot: ParkingLocation): string {
    return `https://www.google.com/maps/search/?api=1&query=${getMapsCoordinates(parkingLot)}`;
}

function Badge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-md border border-outline-variant bg-surface-container px-2.5 py-1 text-label-sm text-on-surface">
            {children}
        </span>
    );
}

function DetailRow({
    icon: Icon,
    label,
    children,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 py-3">
            <Icon className="mt-0.5 size-5 shrink-0 text-on-surface-variant" />
            <dt className="shrink-0 text-body-md text-on-surface-variant">
                {label}
            </dt>
            <dd className="ml-auto min-w-0 text-right text-body-md font-medium wrap-break-word whitespace-pre-line text-on-surface">
                {children}
            </dd>
        </div>
    );
}

function DetailsSkeleton() {
    return (
        <div className="animate-pulse" aria-hidden="true">
            <div className="flex gap-2">
                <div className="h-7 w-24 rounded-md bg-surface-container-high" />
                <div className="h-7 w-14 rounded-md bg-surface-container-high" />
            </div>
            <div className="mt-4 aspect-video w-full rounded-lg bg-surface-container-high" />
            <div className="mt-6 h-5 w-40 rounded bg-surface-container-high" />
            <div className="mt-3 h-4 w-full rounded bg-surface-container-high" />
            <div className="mt-2 h-4 w-2/3 rounded bg-surface-container-high" />
            <div className="mt-6 space-y-4">
                {Array.from({ length: 5 }, (_, index) => (
                    <div
                        key={index}
                        className="h-5 w-full rounded bg-surface-container-high"
                    />
                ))}
            </div>
        </div>
    );
}

function DetailsContent({ details }: { details: ParkingLocationDetails }) {
    const priceLabel = getPriceLabel(details.estimated_price);

    return (
        <>
            <div className="flex flex-wrap gap-2">
                <Badge>{typeLabels[details.types] ?? details.types}</Badge>
                {priceLabel && <Badge>{priceLabel}</Badge>}
            </div>

            <div className="mt-4">
                <ParkingImageGallery
                    key={details.id}
                    images={details.images}
                    alt={details.name}
                />
            </div>

            {details.description && (
                <section className="mt-5">
                    <h3 className="text-label-bold text-on-surface">
                        About this location
                    </h3>
                    <p className="mt-1 text-body-md text-on-surface-variant">
                        {details.description}
                    </p>
                </section>
            )}

            <dl className="mt-4 divide-y divide-outline-variant border-y border-outline-variant">
                <DetailRow icon={Banknote} label="Price (rough estimate)">
                    {formatPrice(details.estimated_price)}
                </DetailRow>
                <DetailRow icon={Clock} label="Operating hours">
                    {details.opening_time} – {details.closing_time}
                </DetailRow>
                <DetailRow icon={SquareParking} label="Parking type">
                    {typeLabels[details.types] ?? details.types}
                </DetailRow>
                <DetailRow icon={MapPin} label="Address (approx.)">
                    {details.approximate_address}
                </DetailRow>
                <DetailRow icon={Tag} label="Source">
                    {details.source}
                </DetailRow>
                <DetailRow icon={CalendarCheck} label="Last updated">
                    {formatDate(details.updated_at)}
                </DetailRow>
            </dl>

            <div className="mt-4 flex gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-3">
                <Info className="mt-0.5 size-5 shrink-0 text-on-surface-variant" />
                <p className="text-label-sm text-on-surface-variant">
                    This is a reported parking area. We do not show real-time
                    availability.
                </p>
            </div>
        </>
    );
}

export default function ParkingDetailModal({
    parkingLot,
    open,
    onOpenChange,
    onViewOnMap,
}: ParkingDetailModalProps) {
    const { details, isLoading, isError, retry } = useParkingLocationDetails(
        parkingLot?.id ?? null,
    );
    const [linkCopied, setLinkCopied] = useState(false);
    const copiedTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current !== null) {
                window.clearTimeout(copiedTimeoutRef.current);
            }
        };
    }, []);

    const handleShare = async () => {
        if (!parkingLot) {
            return;
        }

        const url = getShareUrl(parkingLot);

        if (navigator.share) {
            try {
                await navigator.share({ title: parkingLot.name, url });
            } catch {
                // User dismissed the share sheet.
            }

            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setLinkCopied(true);

            if (copiedTimeoutRef.current !== null) {
                window.clearTimeout(copiedTimeoutRef.current);
            }

            copiedTimeoutRef.current = window.setTimeout(
                () => setLinkCopied(false),
                2000,
            );
        } catch (error) {
            console.error('Unable to copy link', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="flex h-[calc(100dvh-1.5rem)] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest p-0 text-on-surface shadow-2xl sm:h-[min(90dvh,860px)] sm:max-w-md"
            >
                {parkingLot && (
                    <>
                        {/* Top bar */}
                        <div className="flex items-center justify-between px-2 pt-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="size-11 rounded-full text-on-surface hover:bg-surface-container"
                                >
                                    <X className="size-5" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </DialogClose>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="size-11 rounded-full text-on-surface hover:bg-surface-container"
                            >
                                {linkCopied ? (
                                    <Check className="size-5 text-primary" />
                                ) : (
                                    <Share2 className="size-5" />
                                )}
                                <span className="sr-only">
                                    {linkCopied
                                        ? 'Link copied'
                                        : 'Share location'}
                                </span>
                            </Button>
                        </div>

                        {/* Scrollable body */}
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">
                            <DialogTitle className="text-headline-lg text-on-surface">
                                {parkingLot.name}
                            </DialogTitle>
                            <DialogDescription className="mt-1 mb-4 text-body-md text-on-surface-variant">
                                {formatDistance(parkingLot.distance)}
                            </DialogDescription>

                            {isLoading && <DetailsSkeleton />}

                            {isError && (
                                <div
                                    role="alert"
                                    className="flex flex-col items-center gap-3 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-10 text-center"
                                >
                                    <p className="text-body-md text-on-surface-variant">
                                        We couldn't load this parking location's
                                        details.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={retry}
                                        className="min-h-11 rounded-md border-outline-variant text-primary"
                                    >
                                        Try again
                                    </Button>
                                </div>
                            )}

                            {details && <DetailsContent details={details} />}
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 border-t border-outline-variant bg-surface-container-lowest p-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onViewOnMap(parkingLot)}
                                className="min-h-12 rounded-md border-outline-variant bg-surface text-primary hover:bg-surface-container"
                            >
                                <MapIcon className="size-5" />
                                View on Map
                            </Button>

                            <Button
                                asChild
                                className="min-h-12 rounded-md bg-primary text-on-primary hover:bg-primary-container"
                            >
                                <a
                                    href={getDirectionsUrl(parkingLot)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Navigation className="size-5" />
                                    Get Directions
                                </a>
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
