<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ParkingLocation extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'description',
        'approximate_address',
        'latitude',
        'longitude',
        'opening_time',
        'closing_time',
        'types',
        'estimated_price',
        'source',
        'status',
    ];

    public function targetLocations(): BelongsToMany
    {
        return $this->belongsToMany(TargetLocation::class)
            ->withPivot('target_distance')
            ->withTimestamps();
    }
}