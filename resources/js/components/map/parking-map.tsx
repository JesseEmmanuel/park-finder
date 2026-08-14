import { circle } from '@turf/circle';
import { Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import type { MapOptions, GeoJSONSource } from 'maplibre-gl';

import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef } from 'react';

setWorkerUrl(workerUrl);

interface ParkingMapProps {
    center?: [number, number];
    zoom?: number;
    radius?: number;
    className?: string;
}

const RADIUS_SOURCE_ID = 'search-radius';
const RADIUS_FILL_ID = 'search-radius-fill';
const RADIUS_LINE_ID = 'search-radius-line';

export default function ParkingMap({
    center = [121.774, 12.8797],
    zoom = 5,
    radius = 500,
    className = '',
}: ParkingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

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
            /*
             * Destination marker
             */
            const marker = new Marker({
                color: '#1e3a8a',
            })
                .setLngLat(center)
                .addTo(map);

            markerRef.current = marker;

            /*
             * Radius circle
             */
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
    }, [center, radius, zoom]);

    /*
     * Update radius when the selected radius changes
     */
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

    return (
        <div ref={mapContainerRef} className={`h-full w-full ${className}`} />
    );
}
