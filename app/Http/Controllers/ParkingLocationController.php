<?php

namespace App\Http\Controllers;

use App\Models\ParkingLocation;
use App\Models\ParkingLocationImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ParkingLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $lat = $request->input('lat');
        $lon = $request->input('lon');
        $radius = $request->input('radius', 500);

        $parkingLocations = [];

        if ($lat && $lon) {
            $earthRadius = 6371000;

            $haversineSql = "(? * acos(cos(radians(?::double precision)) * cos(radians(latitude::double precision)) * cos(radians(longitude::double precision) - radians(?::double precision)) + sin(radians(?::double precision)) * sin(radians(latitude::double precision))))";
            $baseQuery = ParkingLocation::query()
                ->approved()
                ->select('parking_locations.*')
                ->selectRaw("{$haversineSql} AS distance", [
                    $earthRadius,
                    $lat,
                    $lon,
                    $lat
                ]);

            $parkingLocations = DB::query()
                ->fromSub($baseQuery, 'p')
                ->where('distance', '<=', $radius)
                ->orderBy('distance', 'asc')
                ->get()
                ->map(function ($location) {
                    $location->distance = round($location->distance);
                    return $location;
                });

            return Inertia::render('driver/map/page', [
                'parkingLots' => $parkingLocations,
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $parkingLocation = ParkingLocation::query()
            ->approved()
            ->with('images')
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $parkingLocation->id,
                'name' => $parkingLocation->name,
                'description' => $parkingLocation->description,
                'approximate_address' => $parkingLocation->approximate_address,
                'latitude' => (float) $parkingLocation->latitude,
                'longitude' => (float) $parkingLocation->longitude,
                'opening_time' => $parkingLocation->opening_time,
                'closing_time' => $parkingLocation->closing_time,
                'types' => $parkingLocation->types,
                'estimated_price' => $parkingLocation->estimated_price,
                'source' => $parkingLocation->source,
                'updated_at' => $parkingLocation->updated_at?->toIso8601String(),
                'images' => $parkingLocation->images
                    ->map(fn (ParkingLocationImage $image) => [
                        'id' => $image->id,
                        'url' => $image->url(),
                    ])
                    ->values(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
