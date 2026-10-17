<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ParkingLocationImage extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'parking_location_id',
        'image_path',
    ];

    /**
     * @return BelongsTo<ParkingLocation, $this>
     */
    public function parkingLocation(): BelongsTo
    {
        return $this->belongsTo(ParkingLocation::class);
    }

    /**
     * Resolve the stored path to a publicly accessible URL.
     */
    public function url(): string
    {
        if (Str::startsWith($this->image_path, ['http://', 'https://'])) {
            return $this->image_path;
        }

        return Storage::disk('public')->url($this->image_path);
    }
}
