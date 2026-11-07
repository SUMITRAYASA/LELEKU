<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KolamController;

Route::apiResource('kolam', KolamController::class);