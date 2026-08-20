<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\TargetLocation;
use App\Models\ParkingLocation;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $targetLat = 10.6941504;
        $targetLng = 122.5636379;

        // 1. Create Robinsons Place Iloilo
        $robinsons = TargetLocation::create([
            'id' => Str::uuid(),
            'name' => 'Robinsons Place Iloilo',
            'approximate_address' => 'Quezon St, Iloilo City Proper, Iloilo City, Iloilo',
            'latitude' => (string) $targetLat,
            'longitude' => (string) $targetLng,
        ]);

        // 2. Generate 10 nearby parking locations
        // 0.004 degrees is roughly 400-500 meters
        $parkingLocations = ParkingLocation::factory()->count(10)->create([
            'latitude' => fn() => (string) ($targetLat + fake()->randomFloat(6, -0.004, 0.004)),
            'longitude' => fn() => (string) ($targetLng + fake()->randomFloat(6, -0.004, 0.004)),
        ]);

        // 3. Attach and calculate distance for the pivot table
        foreach ($parkingLocations as $parking) {
            $distanceInMeters = $this->calculateDistanceInMeters(
                $targetLat,
                $targetLng,
                (float) $parking->latitude,
                (float) $parking->longitude
            );

            $robinsons->parkingLocations()->attach($parking->id, [
                'target_distance' => (string) $distanceInMeters,
            ]);
        }
    }

    /**
     * Haversine formula to calculate distance between two coordinates in meters
     */
    private function calculateDistanceInMeters($lat1, $lon1, $lat2, $lon2): int
    {
        $earthRadius = 6371000; // Earth's radius in meters

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int) round($earthRadius * $c);
    }
}