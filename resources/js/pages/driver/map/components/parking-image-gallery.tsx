import { useState } from 'react';
import type { SyntheticEvent } from 'react';

import type { ParkingLocationImage } from '@/types/location';
import ParkingImageLightbox from './parking-image-lightbox';

export const PARKING_PLACEHOLDER_IMAGE = '/images/parking-placeholder.svg';

interface ParkingImageGalleryProps {
    images: ParkingLocationImage[];
    alt: string;
}

const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;

    if (!image.src.endsWith(PARKING_PLACEHOLDER_IMAGE)) {
        image.src = PARKING_PLACEHOLDER_IMAGE;
    }
};

export default function ParkingImageGallery({
    images,
    alt,
}: ParkingImageGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // No photos: show the placeholder banner, nothing to enlarge.
    if (images.length === 0) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container">
                <img
                    src={PARKING_PLACEHOLDER_IMAGE}
                    alt="No photo available"
                    draggable={false}
                    className="size-full object-cover"
                />
            </div>
        );
    }

    const lightbox = (
        <ParkingImageLightbox
            images={images}
            alt={alt}
            index={lightboxIndex}
            onIndexChange={setLightboxIndex}
            fallbackSrc={PARKING_PLACEHOLDER_IMAGE}
        />
    );

    // A single photo: full-width banner.
    if (images.length === 1) {
        return (
            <>
                <button
                    type="button"
                    onClick={() => setLightboxIndex(0)}
                    className="block aspect-video w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container"
                >
                    <img
                        src={images[0].url}
                        alt={`${alt} photo`}
                        decoding="async"
                        draggable={false}
                        onError={handleImageError}
                        className="size-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                    />
                    <span className="sr-only">View photo full screen</span>
                </button>
                {lightbox}
            </>
        );
    }

    // Multiple photos: masonry grid, images keep their natural aspect ratio.
    return (
        <>
            <ul
                aria-label={`${alt} photos`}
                className="columns-2 gap-2 [&>li]:mb-2"
            >
                {images.map((image, index) => (
                    <li key={image.id} className="break-inside-avoid">
                        <button
                            type="button"
                            onClick={() => setLightboxIndex(index)}
                            className="block w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container"
                        >
                            <img
                                src={image.url}
                                alt={`${alt} photo ${index + 1}`}
                                loading={index < 4 ? 'eager' : 'lazy'}
                                decoding="async"
                                draggable={false}
                                onError={handleImageError}
                                className="block h-auto max-h-80 min-h-24 w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                            />
                            <span className="sr-only">
                                View photo {index + 1} full screen
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
            {lightbox}
        </>
    );
}
