<?php

namespace App\Http\Controllers;

use App\Models\ParkingLocation;
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
    public function show(string $id)
    {
        //
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
