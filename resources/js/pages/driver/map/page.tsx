import { router } from '@inertiajs/react';
import { HomeIcon, List } from 'lucide-react';
import { useState } from 'react';

import ParkingMap from '@/components/map/parking-map';
import SearchLocation from '@/components/map/search-location';
import { Button } from '@/components/ui/button';
import type { ParkingLocation } from '@/types/location';
import ParkingDetailModal from './components/parking-detail-modal';
import ParkingSheet from './components/parking-sheet';
interface PageProps {
    parkingLots: ParkingLocation[];
}

export default function Page({ parkingLots }: PageProps) {
    console.log('pariking lots from page:', parkingLots);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedParkingLot, setSelectedParkingLot] =
        useState<ParkingLocation | null>(null);
    // Kept separate from the selection so the modal keeps its content
    // while the close animation plays.
    const [detailOpen, setDetailOpen] = useState(false);
    const [focusTarget, setFocusTarget] = useState<{
        lng: number;
        lat: number;
    } | null>(null);

    const handleParkingLotSelect = (parkingLot: ParkingLocation) => {
        setSelectedParkingLot(parkingLot);
        setDetailOpen(true);
    };

    const handleViewOnMap = (parkingLot: ParkingLocation) => {
        setDetailOpen(false);
        setSheetOpen(false);
        setFocusTarget({
            lng: Number(parkingLot.longitude),
            lat: Number(parkingLot.latitude),
        });
    };

    const params = new URLSearchParams(window.location.search);

    const lat = Number(params.get('lat'));
    const lon = Number(params.get('lon'));
    const zoom = Number(params.get('zoom'));
    const radiusParam = Number(params.get('radius'));

    const [radius, setRadius] = useState(
        Number.isFinite(radiusParam) ? radiusParam : 500,
    );

    const hasLocation = Number.isFinite(lat) && Number.isFinite(lon);

    const center: [number, number] = hasLocation
        ? [lon, lat]
        : [121.774, 12.8797];

    const mapZoom = Number.isFinite(zoom) ? zoom : 5;

    const handleBack = () => {
        router.visit('/');
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <ParkingMap
                center={center}
                zoom={mapZoom}
                radius={radius}
                parkingLots={parkingLots}
                onParkingLotSelect={handleParkingLotSelect}
                focusTarget={focusTarget}
            />

            {/* Floating search */}
            <div className="absolute top-6 right-4 left-4 z-20 flex justify-center">
                <div className="w-full max-w-3xl">
                    <SearchLocation />
                </div>
            </div>

            {/* Find parking */}
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleBack}
                    className="shadow-floating size-12 rounded-md border-outline-variant bg-surface-container-lowest text-primary hover:bg-surface-container"
                    aria-label="Back to home"
                >
                    <HomeIcon className="size-5" />
                </Button>
                <Button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="shadow-floating min-h-12 rounded-full bg-primary px-6 text-label-bold text-on-primary hover:bg-primary-container"
                >
                    <List className="size-5" />
                    Find Parking
                </Button>
            </div>

            <ParkingSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                radius={radius}
                onRadiusChange={setRadius}
                parkingLots={parkingLots}
                onParkingLotSelect={handleParkingLotSelect}
            />

            <ParkingDetailModal
                parkingLot={selectedParkingLot}
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onViewOnMap={handleViewOnMap}
            />
        </div>
    );
}
