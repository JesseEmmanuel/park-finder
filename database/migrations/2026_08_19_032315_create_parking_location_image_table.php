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

        if (!Schema::hasTable('parking_location_image')) {
            $this->createParkingLocationImageTable();
        }
    }

    private function createParkingLocationImageTable(): void
    {
        Schema::create('parking_location_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parking_location_id');
            $table->string('image_path');
            $table->foreign('parking_location_id')->references('id')->on('parking_locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_location_image');
    }
};