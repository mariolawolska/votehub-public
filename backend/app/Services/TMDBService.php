<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class TMDBService {

    protected string $apiKey;
    protected string $baseUrl;

    /**
     * Initialize TMDB client using configuration values.
     *
     * The service loads API credentials from config/services.php
     * and exposes a unified request() method for all TMDB endpoints.
     */
    public function __construct() {
        $this->apiKey = config('services.tmdb.key');
        $this->baseUrl = config('services.tmdb.url');
    }

    /**
     * Perform a GET request to a TMDB API endpoint.
     *
     * Automatically injects:
     * - API key
     * - default language (en-US)
     *
     * @param string $endpoint  TMDB endpoint path (e.g. "movie/popular").
     * @param array  $params    Additional query parameters.
     *
     * @return array            Decoded JSON response.
     */
    public function request(string $endpoint, array $params = []) {
        return Http::get("{$this->baseUrl}/{$endpoint}", array_merge([
            'api_key' => $this->apiKey,
            'language' => 'en-US'
        ], $params))->json();
    }

    /**
     * Fetch a paginated list of popular movies.
     *
     * @param int $page
     * @return array
     */
    public function popularMovies($page = 1) {
        return $this->request('movie/popular', ['page' => $page]);
    }

    /**
     * Search for movies by title.
     *
     * @param string $query
     * @return array
     */
    public function searchMovies(string $query) {
        return $this->request('search/movie', ['query' => $query]);
    }

    /**
     * Discover movies using TMDB filters.
     *
     * @param array $params
     * @return array
     */
    public function discoverMovies(array $params = []) {
        return $this->request('discover/movie', $params);
    }

    /**
     * Extract poster_path from a TMDB movie URL.
     *
     * Steps:
     * - parse movie ID from URL
     * - fetch movie details
     * - return poster_path or null
     *
     * @param string $url
     * @return string|null
     */
    public function getPosterPathFromUrl(string $url): ?string {
        preg_match('/movie\/(\d+)/', $url, $matches);

        if (!isset($matches[1])) {
            return null;
        }

        $movieId = $matches[1];

        $response = Http::get("https://api.themoviedb.org/3/movie/{$movieId}", [
            'api_key' => env('TMDB_API_KEY'),
        ]);

        if (!$response->successful()) {
            return null;
        }

        return $response->json()['poster_path'] ?? null;
    }

    /**
     * Retrieve poster_path by movie title.
     *
     * @param string $title
     * @return string|null
     */
    public function getPosterPathByTitle(string $title): ?string {
        $response = Http::get("https://api.themoviedb.org/3/search/movie", [
            'api_key' => env('TMDB_API_KEY'),
            'query' => $title,
        ]);

        if (!$response->successful()) {
            return null;
        }

        $results = $response->json()['results'] ?? [];

        return $results[0]['poster_path'] ?? null;
    }

    /**
     * Retrieve poster_path by movie title and release year.
     *
     * @param string   $title
     * @param int|null $year
     * @return string|null
     */
    public function getPosterPathByTitleAndYear(string $title, ?int $year): ?string {
        $response = Http::get("https://api.themoviedb.org/3/search/movie", [
            'api_key' => env('TMDB_API_KEY'),
            'query' => $title,
            'year' => $year,
        ]);

        if (!$response->successful()) {
            return null;
        }

        $results = $response->json()['results'] ?? [];

        return $results[0]['poster_path'] ?? null;
    }

    /**
     * Fetch trending movies for the current week.
     *
     * @param int $page
     * @return array
     */
    public function trendingMovies($page = 1) {
        return Http::get("https://api.themoviedb.org/3/trending/movie/week", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }

    /**
     * Discover movies including video metadata.
     *
     * @param int $page
     * @return array
     */
    public function discoverMoviesWithVideos(int $page = 1): array {
        return Http::get("https://api.themoviedb.org/3/discover/movie", [
            'api_key' => env('TMDB_API_KEY'),
            'sort_by' => 'popularity.desc',
            'include_adult' => false,
            'include_video' => true,
            'page' => $page,
            'with_original_language' => 'en',
        ])->json();
    }

    /**
     * Retrieve the best available trailer (Trailer > Teaser > Clip).
     *
     * Returns a YouTube embed URL or null.
     *
     * @param int $movieId
     * @return string|null
     */
    public function getTrailer(int $movieId): ?string {
        $response = Http::get("https://api.themoviedb.org/3/movie/{$movieId}/videos", [
            'api_key' => env('TMDB_API_KEY')
        ])->json();

        if (!isset($response['results']) || !is_array($response['results'])) {
            return null;
        }

        $videos = collect($response['results']);

        $pick = fn(string $type) => $videos->first(fn($v) =>
            ($v['type'] ?? null) === $type &&
            ($v['site'] ?? null) === 'YouTube'
        );

        if ($t = $pick('Trailer')) {
            return "https://www.youtube.com/embed/{$t['key']}";
        }
        if ($t = $pick('Teaser')) {
            return "https://www.youtube.com/embed/{$t['key']}";
        }
        if ($t = $pick('Clip')) {
            return "https://www.youtube.com/embed/{$t['key']}";
        }

        return null;
    }

    /**
     * Fetch full movie details by ID.
     *
     * @param int $movieId
     * @return array
     */
    public function getMovie(int $movieId): array {
        return Http::get("https://api.themoviedb.org/3/movie/{$movieId}", [
            'api_key' => env('TMDB_API_KEY')
        ])->json();
    }

    /**
     * Fetch movies currently in cinemas.
     *
     * @param int $page
     * @return array
     */
    public function nowPlaying($page = 1) {
        return Http::get("https://api.themoviedb.org/3/movie/now_playing", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }

    /**
     * Fetch upcoming movie releases.
     *
     * @param int $page
     * @return array
     */
    public function upcoming($page = 1) {
        return Http::get("https://api.themoviedb.org/3/movie/upcoming", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }

    /**
     * Fetch popular movies (alternative endpoint).
     *
     * @param int $page
     * @return array
     */
    public function popular($page = 1) {
        return Http::get("https://api.themoviedb.org/3/movie/popular", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }

    /**
     * Fetch top-rated movies.
     *
     * @param int $page
     * @return array
     */
    public function topRated($page = 1) {
        return Http::get("https://api.themoviedb.org/3/movie/top_rated", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }

    /**
     * Fetch trending movies for the current day.
     *
     * @param int $page
     * @return array
     */
    public function trendingDay($page = 1) {
        return Http::get("https://api.themoviedb.org/3/trending/movie/day", [
            'api_key' => env('TMDB_API_KEY'),
            'page' => $page
        ])->json();
    }
}
