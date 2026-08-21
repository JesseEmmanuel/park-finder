import { Map } from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function BackgroundMap() {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) {
            return;
        }

        mapRef.current = new Map({
            container: mapContainerRef.current,
            style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            center: [122.5065003, 10.7312154],
            zoom: 13,
            interactive: false,
            attributionControl: false,
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        <div ref={mapContainerRef} className="h-screen w-full bg-slate-100" />
    );
}
