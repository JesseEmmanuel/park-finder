import { circle } from '@turf/circle';
import {
    Map,
    Marker,
    NavigationControl,
    setWorkerUrl,
    Popup,
} from 'maplibre-gl';
import type { MapOptions, GeoJSONSource } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';
import type { ParkingLocation } from '@/types/location';

setWorkerUrl(workerUrl);

interface ParkingMapProps {
    center?: [number, number];
    zoom?: number;
    radius?: number;
    className?: string;
    parkingLots?: ParkingLocation[];
    onParkingLotSelect?: (parkingLot: ParkingLocation) => void;
    /** A new object reference re-centres the map, even on the same spot. */
    focusTarget?: { lng: number; lat: number } | null;
}

const RADIUS_SOURCE_ID = 'search-radius';
const RADIUS_FILL_ID = 'search-radius-fill';
const RADIUS_LINE_ID = 'search-radius-line';

export default function ParkingMap({
    center = [121.774, 12.8797],
    zoom = 5,
    radius = 500,
    className = '',
    parkingLots = [],
    onParkingLotSelect,
    focusTarget = null,
}: ParkingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);
    const onParkingLotSelectRef = useRef(onParkingLotSelect);

    useEffect(() => {
        onParkingLotSelectRef.current = onParkingLotSelect;
    }, [onParkingLotSelect]);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) {
            return;
        }

        const apiKey = import.meta.env.VITE_GEOAPIFY_API_KEY;

        if (!apiKey) {
            console.error('VITE_GEOAPIFY_API_KEY is not defined.');

            return;
        }

        const mapOptions: MapOptions = {
            container: mapContainerRef.current,
            style: `https://maps.geoapify.com/v1/styles/osm-bright-smooth/style.json?apiKey=${apiKey}`,
            center,
            zoom,
            attributionControl: false,
        };

        const map = new Map(mapOptions);

        map.addControl(new NavigationControl(), 'bottom-right');

        map.on('load', () => {
            const marker = new Marker({
                color: '#1e3a8a',
            })
                .setLngLat(center)
                .addTo(map);

            markerRef.current = marker;
            const radiusCircle = circle(center, radius, {
                steps: 64,
                units: 'meters',
            });

            map.addSource(RADIUS_SOURCE_ID, {
                type: 'geojson',
                data: radiusCircle,
            });

            map.addLayer({
                id: RADIUS_FILL_ID,
                type: 'fill',
                source: RADIUS_SOURCE_ID,
                paint: {
                    'fill-color': '#3b82f6',
                    'fill-opacity': 0.12,
                },
            });

            map.addLayer({
                id: RADIUS_LINE_ID,
                type: 'line',
                source: RADIUS_SOURCE_ID,
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 2,
                    'line-opacity': 0.5,
                },
            });
        });

        map.on('error', (event) => {
            console.error('MapLibre error:', event);
        });

        mapRef.current = map;

        return () => {
            markerRef.current?.remove();
            markerRef.current = null;

            map.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (!map) {
            return;
        }

        const updateRadius = () => {
            const source = map.getSource(RADIUS_SOURCE_ID);

            if (!source) {
                return;
            }

            const radiusCircle = circle(center, radius, {
                steps: 64,
                units: 'meters',
            });

            (source as GeoJSONSource).setData(radiusCircle);
        };

        if (map.isStyleLoaded()) {
            updateRadius();
        } else {
            map.once('load', updateRadius);
        }
    }, [center, radius]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !parkingLots) {
            return;
        }

        const currentMarkers: Marker[] = [];
        parkingLots.forEach((spot) => {
            const lng = Number(spot.longitude);
            const lat = Number(spot.latitude);

            if (Number.isFinite(lng) && Number.isFinite(lat)) {
                const popup = new Popup({
                    offset: 25,
                    closeButton: false,
                    closeOnClick: false,
                }).setHTML(
                    `<div class="p-2 min-w-37.5">
                        <h4 class="font-bold text-sm text-gray-900">${spot.name}</h4>
                        <p class="text-xs text-gray-600 mt-0.5">${spot.approximate_address}</p>
                        <p class="text-xs font-semibold text-blue-600 mt-1.5">${spot.distance}m away</p>
                    </div>`,
                );
                const marker = new Marker({ color: '#2563eb' })
                    .setLngLat([lng, lat])
                    .addTo(map);
                const markerElement = marker.getElement();
                markerElement.style.cursor = 'pointer';
                markerElement.addEventListener('mouseenter', () => {
                    popup.setLngLat([lng, lat]).addTo(map);
                });
                markerElement.addEventListener('mouseleave', () => {
                    popup.remove();
                });
                markerElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    popup.remove();
                    onParkingLotSelectRef.current?.(spot);
                });

                currentMarkers.push(marker);
            }
        });

        return () => {
            currentMarkers.forEach((marker) => marker.remove());
        };
    }, [parkingLots]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !focusTarget) {
            return;
        }

        const { lng, lat } = focusTarget;

        if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
            return;
        }

        map.flyTo({
            center: [lng, lat],
            zoom: Math.max(map.getZoom(), 17),
            essential: true,
        });
    }, [focusTarget]);

    console.log('parking-lots from parking-map:', parkingLots);

    return (
        <div ref={mapContainerRef} className={`h-full w-full ${className}`} />
    );
}
