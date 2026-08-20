<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('parking_location_target_location')) {
            $this->createParkingLocationTargetLocationTable();
        }
    }

    private function createParkingLocationTargetLocationTable(): void
    {
        Schema::create('parking_location_target_location', function (Blueprint $table) {
            $table->uuid('parking_location_id');
            $table->uuid('target_location_id');
            $table->string('target_distance'); //in meters
            $table->foreign('parking_location_id')->references('id')->on('parking_locations')->onDelete('cascade');
            $table->foreign('target_location_id')->references('id')->on('target_locations')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_location_target_location');
    }
};