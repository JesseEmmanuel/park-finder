<?php

namespace App\Http\Controllers;

use App\Models\TargetLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LocationSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim($request->string('q')->toString());

        if (mb_strlen($query) < 2) {
            return response()->json([
                'data' => [],
            ]);
        }

        $databaseResults = $this->searchDatabase($query);
        $geoapifyResults = $this->searchGeoapify($query);

        $results = collect([
            ...$databaseResults,
            ...$geoapifyResults,
        ])
            ->unique(function (array $location) {
                /*
                 * Coordinates are more reliable than names for
                 * identifying duplicate locations.
                 */
                return sprintf(
                    '%.5f:%.5f',
                    $location['lat'],
                    $location['lon'],
                );
            })
            ->take(8)
            ->values();

        return response()->json([
            'data' => $results,
        ]);
    }

    private function searchDatabase(string $query): array
    {
        /**
         * @return array<string, mixed>
         */
        return TargetLocation::query()
            ->where(function ($builder) use ($query) {
                $builder
                    ->where('name', 'ILIKE', "%{$query}%")
                    ->orWhere('approximate_address', 'ILIKE', "%{$query}%");
            })
            ->limit(5)
            ->get()
            ->map(function (TargetLocation $location) {
                return [
                    'id' => 'database-'.$location->id,
                    'name' => $location->name,
                    'formatted' => $location->approximate_address ?? $location->name,
                    'lat' => (float) $location->latitude,
                    'lon' => (float) $location->longitude,
                    'source' => 'database',
                ];
            })
            ->toArray();
    }

    private function searchGeoapify(string $query): array
    {
        $apiKey = config('services.geoapify.api_key');

        if (! $apiKey) {
            // logger()->error('Geoapify API key is missing.');

            return [];
        }

        try {
            $response = Http::timeout(5)
                ->get('https://api.geoapify.com/v1/geocode/autocomplete', [
                    'text' => $query,
                    'apiKey' => $apiKey,
                    'limit' => 5,
                ]);

            logger()->debug('Geoapify response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if (! $response->successful()) {
                logger()->error('Geoapify request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            }

            /**
             * @return array<string, mixed>
             */
            return collect($response->json('features', []))
                ->map(function (array $feature) {
                    $properties = $feature['properties'] ?? [];

                    return [
                        'id' => 'geoapify-'.($properties['place_id'] ?? uniqid()),
                        'name' => $properties['name']
                            ?? $properties['formatted']
                            ?? 'Unknown location',
                        'formatted' => $properties['formatted']
                            ?? $properties['name']
                            ?? '',
                        'lat' => (float) ($properties['lat'] ?? 0),
                        'lon' => (float) ($properties['lon'] ?? 0),
                        'source' => 'geoapify',
                    ];
                })
                ->filter(function (array $location) {
                    return $location['lat'] !== 0
                        && $location['lon'] !== 0;
                })
                ->values()
                ->toArray();
        } catch (\Throwable $e) {
            logger()->error('Geoapify exception', [
                'message' => $e->getMessage(),
            ]);

            return [];
        }
    }
}
