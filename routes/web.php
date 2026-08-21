<?php

use App\Http\Controllers\TargetLocationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::inertia('/', 'welcome')->name('home');
Route::get('/', function () {
    return Inertia::render('driver/page');
})->name('driver.index');

Route::get('/driver/map', function () {
    return Inertia::render('driver/map/page');
})->name('driver.map');

Route::get('/admin', function () {
    return Inertia::render('admin/login/page');
})->name('admin.index');

Route::get('/location-search', TargetLocationController::class)
    ->name('location.search');
