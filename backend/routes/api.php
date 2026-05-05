<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ProductController as ApiProductController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MovieController;

// =========================
// AUTH (JWT)
// =========================

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('jwt.auth')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// =========================
// PUBLIC ENDPOINTS
// =========================

Route::get('/products', [ApiProductController::class, 'index']);
Route::get('/products/hero', [ApiProductController::class, 'hero']);
Route::get('/products/{product}', [ApiProductController::class, 'show']);

Route::get('/products/{product}/comments', [CommentController::class, 'index']);

// =========================
// PROTECTED ENDPOINTS (JWT)
// =========================

Route::middleware('jwt.auth')->group(function () {
    Route::post('/products/{id}/vote', [VoteController::class, 'voteApi']);
    Route::get('/products/{id}/vote/check', [VoteController::class, 'check']);
    Route::post('/products/{product}/comments', [CommentController::class, 'store']);
});



// =========================
// MOVIES
// =========================

Route::get('/movies/popular', [MovieController::class, 'popular']);
Route::get('/movies/search', [MovieController::class, 'search']);
Route::post('/movies/import-many', [MovieController::class, 'importMany']);
Route::post('/movies/import/{id}', [MovieController::class, 'import']);
Route::get('/movies/{id}', [MovieController::class, 'show'])->whereNumber('id');
Route::get('/movies/import-popular', [MovieController::class, 'importPopularMany']);
Route::get('/movies/import-genres', [MovieController::class, 'importByGenres']);
