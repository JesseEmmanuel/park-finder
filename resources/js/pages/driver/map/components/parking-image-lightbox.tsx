import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef } from 'react';
import type { KeyboardEvent, SyntheticEvent, TouchEvent } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import type { ParkingLocationImage } from '@/types/location';

const SWIPE_THRESHOLD = 50;

interface ParkingImageLightboxProps {
    images: ParkingLocationImage[];
    alt: string;
    /** Index of the photo being viewed; `null` closes the lightbox. */
    index: number | null;
    onIndexChange: (index: number | null) => void;
    fallbackSrc: string;
}

export default function ParkingImageLightbox({
    images,
    alt,
    index,
    onIndexChange,
    fallbackSrc,
}: ParkingImageLightboxProps) {
    const touchStartXRef = useRef<number | null>(null);

    const total = images.length;
    const hasMultiple = total > 1;
    const image = index !== null ? images[index] : undefined;

    const showPrevious = () => {
        if (index !== null && hasMultiple) {
            onIndexChange((index - 1 + total) % total);
        }
    };

    const showNext = () => {
        if (index !== null && hasMultiple) {
            onIndexChange((index + 1) % total);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPrevious();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showNext();
        }
    };

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        touchStartXRef.current = event.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const startX = touchStartXRef.current;
        const endX = event.changedTouches[0]?.clientX;

        touchStartXRef.current = null;

        if (startX === null || endX === undefined) {
            return;
        }

        const deltaX = endX - startX;

        if (deltaX > SWIPE_THRESHOLD) {
            showPrevious();
        } else if (deltaX < -SWIPE_THRESHOLD) {
            showNext();
        }
    };

    const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
        const element = event.currentTarget;

        if (!element.src.endsWith(fallbackSrc)) {
            element.src = fallbackSrc;
        }
    };

    return (
        <Dialog
            open={index !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onIndexChange(null);
                }
            }}
        >
            <DialogContent
                showCloseButton={false}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-black/95 p-0 text-white shadow-none sm:max-w-none"
            >
                <DialogTitle className="sr-only">{alt} photos</DialogTitle>
                <DialogDescription className="sr-only">
                    {hasMultiple
                        ? 'Use the arrow keys or swipe to browse photos.'
                        : 'Full-size photo.'}
                </DialogDescription>

                {/* Top bar */}
                <div className="flex items-center justify-between px-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
                    <p
                        className="px-3 text-label-bold text-white/80"
                        aria-live="polite"
                    >
                        {hasMultiple && index !== null
                            ? `${index + 1} / ${total}`
                            : ''}
                    </p>

                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-11 rounded-full text-white hover:bg-white/15 hover:text-white"
                        >
                            <X className="size-6" />
                            <span className="sr-only">Close photo viewer</span>
                        </Button>
                    </DialogClose>
                </div>

                {/* Photo */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-16">
                    {image && (
                        <img
                            key={image.id}
                            src={image.url}
                            alt={
                                hasMultiple && index !== null
                                    ? `${alt} photo ${index + 1} of ${total}`
                                    : `${alt} photo`
                            }
                            decoding="async"
                            draggable={false}
                            onError={handleImageError}
                            className="animate-in fade-in-0 max-h-full max-w-full object-contain duration-200 select-none"
                        />
                    )}

                    {hasMultiple && (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={showPrevious}
                                className="absolute top-1/2 left-2 size-11 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-white/15 hover:text-white sm:left-4"
                            >
                                <ChevronLeft className="size-6" />
                                <span className="sr-only">Previous photo</span>
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={showNext}
                                className="absolute top-1/2 right-2 size-11 -translate-y-1/2 rounded-full bg-black/40 text-white hover:bg-white/15 hover:text-white sm:right-4"
                            >
                                <ChevronRight className="size-6" />
                                <span className="sr-only">Next photo</span>
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
