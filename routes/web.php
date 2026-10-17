<?php

use App\Http\Controllers\TargetLocationController;
use App\Http\Controllers\ParkingLocationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::inertia('/', 'welcome')->name('home');
Route::get('/', function () {
    return Inertia::render('driver/page');
})->name('driver.index');

// Route::get('/driver/map', function () {
//     return Inertia::render('driver/map/page');
// })->name('driver.map');

Route::get('/driver/map', [ParkingLocationController::class, 'index'])
    ->name('driver.map');

Route::get('/parking-locations/{id}', [ParkingLocationController::class, 'show'])
    ->whereUuid('id')
    ->name('parking-locations.show');

Route::get('/admin', function () {
    return Inertia::render('admin/login/page');
})->name('admin.index');

Route::get('/location-search', TargetLocationController::class)
    ->name('location.search');
