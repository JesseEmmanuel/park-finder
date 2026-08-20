<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TargetLocation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'approximate_address',
        'latitude',
        'longitude',
    ];

    public function parkingLocations(): BelongsToMany
    {
        return $this->belongsToMany(ParkingLocation::class)
            ->withPivot('target_distance')
            ->withTimestamps();
    }
}