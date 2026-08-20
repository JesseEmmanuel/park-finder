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
        if (! Schema::hasTable('parking_locations')) {
            $this->createParkingLocationTable();
        }
    }

    private function createParkingLocationTable(): void
    {
        Schema::create('parking_locations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('description');
            $table->string('approximate_address');
            $table->string('latitude');
            $table->string('longitude');
            $table->string('opening_time');
            $table->string('closing_time');
            $table->enum('types', ['LOT', 'STREET_SIDE', 'PAID_YARD', 'COMPOUND']);
            $table->string('estimated_price');
            $table->string('source');
            $table->enum('status', ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parking_locations');
    }
};
