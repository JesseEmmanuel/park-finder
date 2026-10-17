<?php

namespace App\Models;

use Database\Factories\ParkingLocationFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ParkingLocation extends Model
{
    /** @use HasFactory<ParkingLocationFactory> */
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

    /**
     * @return BelongsToMany<TargetLocation, $this>
     */
    public function targetLocations(): BelongsToMany
    {
        return $this->belongsToMany(TargetLocation::class)
            ->withPivot('target_distance')
            ->withTimestamps();
    }

    /**
     * Only locations that have passed review and may be shown to drivers.
     *
     * @param  Builder<ParkingLocation>  $query
     */
    #[Scope]
    protected function approved(Builder $query): void
    {
        $query->where('status', 'APPROVED');
    }

    /**
     * @return HasMany<ParkingLocationImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ParkingLocationImage::class);
    }
}
