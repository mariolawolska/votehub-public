<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MovieService;
use App\Services\TMDBService;
use Illuminate\Http\Request;

class MovieController extends Controller {

    /**
     * Return a list of popular movies directly from TMDB.
     *
     * This endpoint:
     * - does NOT store anything in the database
     * - proxies TMDB data to the React frontend
     * - is used for discovery/search UI
     *
     * @param TMDBService $tmdb
     * @return \Illuminate\Http\JsonResponse
     */
    public function popular(TMDBService $tmdb) {
        return response()->json(
            $tmdb->popularMovies()
        );
    }

    /**
     * Return detailed information about a single movie from TMDB.
     *
     * Used by the React frontend when previewing a movie
     * before importing it into the local database.
     *
     * @param int $id  TMDB movie ID
     * @param TMDBService $tmdb
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(int $id, TMDBService $tmdb) {
        return response()->json(
            $tmdb->getMovie($id)
        );
    }

    /**
     * Search for movies in TMDB based on a query string.
     *
     * Query param: ?q=title
     *
     * @param TMDBService $tmdb
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(TMDBService $tmdb) {
        return response()->json(
            $tmdb->searchMovies(request('q'))
        );
    }

    /**
     * Import a single movie from TMDB into the local database.
     *
     * This endpoint:
     * - fetches TMDB metadata
     * - processes poster images through the image pipeline
     * - creates a Product entry with categories and images
     *
     * @param int $id  TMDB movie ID
     * @param MovieService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function import(int $id, MovieService $service) {
        $product = $service->importSingle($id);

        return response()->json([
            'message' => 'Movie imported successfully',
            'product' => $product
        ]);
    }

    /**
     * Import multiple movies by their TMDB IDs.
     *
     * Expected payload:
     * {
     *   "ids": [123, 456, 789],
     *   "categories": ["Action", "Drama"]
     * }
     *
     * @param Request $request
     * @param MovieService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function importMany(Request $request, MovieService $service) {
        $saved = $service->importMany(
            $request->input('ids'),
            $request->input('categories')
        );

        return response()->json([
            'message' => 'Bulk import completed',
            'count' => count($saved),
            'products' => $saved
        ]);
    }

    /**
     * Import popular movies from multiple TMDB pages.
     *
     * Used for initial seeding of the database.
     *
     * @param MovieService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function importPopularMany(MovieService $service) {
        $saved = $service->importPopular(5);

        return response()->json([
            'message' => 'Popular movies imported successfully',
            'count' => count($saved),
            'products' => $saved
        ]);
    }

    /**
     * Import movies by genre using a local mapping of category names
     * to TMDB genre IDs.
     *
     * This endpoint:
     * - fetches movies by genre
     * - processes poster images
     * - assigns categories automatically
     *
     * @param MovieService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function importByGenres(MovieService $service) {
        $genres = [
            'Action' => 28,
            'Drama' => 18,
            'Thriller' => 53,
            'Horror' => 27,
            'Romantic' => 10749,
            'Love' => 10749,
            'Musical' => 10402,
        ];

        $saved = $service->importByGenres($genres);

        return response()->json([
            'message' => 'Movies imported by genre successfully',
            'count' => count($saved),
            'products' => $saved
        ]);
    }
}
