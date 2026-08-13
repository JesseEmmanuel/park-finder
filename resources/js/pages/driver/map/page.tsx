import { router } from '@inertiajs/react';
import { ArrowLeft, HomeIcon, List } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import ParkingMap from '@/components/map/parking-map';
import SearchLocation from '@/components/map/search-location';
import ParkingSheet from './components/parking-sheet';
import { mockParkingLots } from '@/data/mock-parking';

export default function Page() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [radius, setRadius] = useState(500);

  const params = new URLSearchParams(window.location.search);

  const lat = Number(params.get('lat'));
  const lon = Number(params.get('lon'));
  const zoom = Number(params.get('zoom'));

  const hasLocation =
    Number.isFinite(lat) &&
    Number.isFinite(lon);

  const center: [number, number] = hasLocation
    ? [lon, lat]
    : [121.7740, 12.8797];

  const mapZoom = Number.isFinite(zoom)
    ? zoom
    : 5;

  const handleBack = () => {
    router.visit('/');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ParkingMap
        center={center}
        zoom={mapZoom}
        radius={radius}
      />

      {/* Floating search */}
      <div className="absolute left-4 right-4 top-6 z-20 flex justify-center">
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
          className="size-12 rounded-md border-outline-variant bg-surface-container-lowest text-primary shadow-floating hover:bg-surface-container"
          aria-label="Back to home"
        >
          <HomeIcon className="size-5" />
        </Button>
        <Button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="min-h-12 rounded-full bg-primary px-6 text-label-bold text-on-primary shadow-floating hover:bg-primary-container"
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
        parkingLots={mockParkingLots}
      />
    </div>
  );
}