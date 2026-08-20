<?php

namespace Database\Factories;

use App\Models\ParkingLocation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ParkingLocation>
 */
class ParkingLocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->streetName().' Parking',
            'description' => fake()->sentence(),
            'approximate_address' => fake()->address(),
            'latitude' => (string) fake()->latitude(),
            'longitude' => (string) fake()->longitude(),
            'opening_time' => '08:00 AM',
            'closing_time' => '10:00 PM',
            'types' => fake()->randomElement(['LOT', 'STREET_SIDE', 'PAID_YARD', 'COMPOUND']),
            'estimated_price' => fake()->numberBetween(20, 150).' PHP',
            'source' => fake()->company(),
            'status' => 'APPROVED',
        ];
    }
}
