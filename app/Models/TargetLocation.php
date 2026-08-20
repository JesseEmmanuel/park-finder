<?php

namespace App\Models;

use Database\Factories\TargetLocationFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TargetLocation extends Model
{
    /** @use HasFactory<TargetLocationFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'approximate_address',
        'latitude',
        'longitude',
    ];

    /**
     * @return BelongsToMany<ParkingLocation, $this>
     */
    public function parkingLocations(): BelongsToMany
    {
        return $this->belongsToMany(ParkingLocation::class)
            ->withPivot('target_distance')
            ->withTimestamps();
    }
}
