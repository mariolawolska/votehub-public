<?php

use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\CommentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
  |--------------------------------------------------------------------------
  | Public Routes
  |--------------------------------------------------------------------------
  | These routes are accessible without authentication.
 */

Route::get('/', function () {
    return view('welcome');
})->name('welcome');

/*
  |--------------------------------------------------------------------------
  | Protected Routes (session expired → redirect to welcome)
  |--------------------------------------------------------------------------
  | These routes use your custom middleware "auth.redirect".
  | If the user is not authenticated, they are redirected to the welcome page.
 */

Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

    // Products index
    Route::get('/products', [ProductController::class, 'index'])
            ->name('products.index');

    // Search
    Route::get('/products/search', [ProductController::class, 'search'])
            ->name('products.search');

    // Product resource routes
    Route::resource('products', ProductController::class)
            ->except(['index']);

    // Comments
    Route::get('/products/{product}/comments', [CommentController::class, 'index']);
});

/*
  |--------------------------------------------------------------------------
  | Tasks
  |--------------------------------------------------------------------------
  | If tasks should also be protected, move this into the middleware group above.
 */

Route::resource('tasks', TaskController::class);

/*
  |--------------------------------------------------------------------------
  | Product Voting and Search
  |--------------------------------------------------------------------------
 */

Route::post('/products/{id}/vote', [VoteController::class, 'voteWeb'])
        ->name('products.updateVote');

//Route::get('/products/{product}', [ProductController::class, 'show'])
//        ->name('products.show');

/*
  |--------------------------------------------------------------------------
  | Comments
  |--------------------------------------------------------------------------
 */

//Route::get('/products/{product}/comments', [CommentController::class, 'index']);
Route::put('/comments/{comment}', [CommentController::class, 'update'])
        ->name('comments.update');
Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])
        ->name('comments.destroy');

/*
  |--------------------------------------------------------------------------
  | Profile (Jetstream/Fortify)
  |--------------------------------------------------------------------------
 */

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


/*
  |--------------------------------------------------------------------------
  | Google OAuth
  |--------------------------------------------------------------------------
 */

Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
        ->name('auth.google.redirect');

Route::get('/callback', [GoogleAuthController::class, 'callback'])
        ->name('auth.google.callback');

Route::get('/auth/google/redirect/react', [GoogleAuthController::class, 'redirectForReact'])
        ->name('auth.google.redirect.react');

Route::get('/auth/google/callback/react', [GoogleAuthController::class, 'callbackForReact'])
        ->name('auth.google.callback.react');

require __DIR__ . '/auth.php';

