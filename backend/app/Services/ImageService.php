<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\WebpEncoder;

class ImageService {

    protected $manager;

    /**
     * Initialize the Intervention Image manager.
     *
     * The service uses the GD driver and provides a unified API for:
     * - reading uploaded files
     * - resizing and cropping images
     * - generating WebP variants
     * - saving assets to the public storage disk
     */
    public function __construct() {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Upload a user avatar to the public storage.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @return string  Relative storage path.
     */
    public function uploadAvatar($file) {
        $filename = time() . '_' . $file->getClientOriginalName();
        return $file->storeAs('avatars', $filename, 'public');
    }

    /**
     * Generate all responsive image variants for a product.
     *
     * Workflow:
     * - create product directory
     * - generate 16:9 variants (xl, desktop, tablet, mobile, thumb)
     * - encode each variant as WebP
     * - generate a blurred placeholder for LCP optimization
     * - persist metadata in product_images table
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param int $productId
     * @return array<string,string>  Map of size → storage path.
     */
    public function uploadProductImageForProductId($file, int $productId): array {
        Storage::disk('public')->makeDirectory("products/{$productId}");

        $image = $this->manager->read($file->getRealPath());

        $sizes = [
            'xl' => 1600,
            'desktop' => 1200,
            'tablet' => 800,
            'mobile' => 400,
            'thumb' => 150,
        ];

        $paths = [];

        foreach ($sizes as $type => $width) {
            $height = intval($width * 9 / 16);

            $img = $this->manager->read($file->getRealPath());

            $resized = $img
                ->scaleDown($width)
                ->cover($width, $height);

            $path = "products/{$productId}/{$type}.webp";

            $resized->encode(new WebpEncoder(quality: 80))
                ->save(storage_path("app/public/{$path}"));

            $paths[$type] = $path;

            \App\Models\ProductImage::create([
                'product_id' => $productId,
                'type' => $type,
                'path' => $path,
                'format' => 'webp',
            ]);
        }

        // Blur placeholder (LCP optimization)
        $blur = $this->manager->read($file->getRealPath())
            ->scaleDown(20)
            ->blur(15);

        $blurPath = "products/{$productId}/blur.webp";

        $blur->encode(new WebpEncoder(quality: 50))
            ->save(storage_path("app/public/{$blurPath}"));

        $paths['blur'] = $blurPath;

        \App\Models\ProductImage::create([
            'product_id' => $productId,
            'type' => 'blur',
            'path' => $blurPath,
            'format' => 'webp',
        ]);

        return $paths;
    }

    /**
     * Process a TMDB poster image and generate responsive variants.
     *
     * This method:
     * - clears the product directory (Plesk-safe)
     * - downloads the TMDB poster
     * - validates minimum resolution
     * - generates 16:9 WebP variants
     * - generates a blur placeholder
     *
     * @param string $posterPath
     * @param int $movieId
     * @return array<string,string>
     */
    public function processTMDBImage(string $posterPath, int $movieId): array {
        if (!$posterPath) {
            return [];
        }

        Storage::disk('public')->deleteDirectory("products/{$movieId}");

        Storage::disk('public')->makeDirectory("products");
        Storage::disk('public')->makeDirectory("products/{$movieId}");

        $tmdbUrl = "https://image.tmdb.org/t/p/w780{$posterPath}";

        $response = Http::get($tmdbUrl);

        if (!$response->successful()) {
            return [];
        }

        $imageData = $response->body();

        $originalFullPath = storage_path("app/public/products/{$movieId}/original.jpg");
        file_put_contents($originalFullPath, $imageData);

        $image = $this->manager->read($imageData);

        if ($image->width() < 300 || $image->height() < 300) {
            return [];
        }

        $sizes = [
            'xl' => 1400,
            'desktop' => 1024,
            'tablet' => 768,
            'mobile' => 600,
            'thumb' => 150,
        ];

        $paths = [];

        foreach ($sizes as $type => $width) {
            $height = intval($width * 9 / 16);

            $img = $this->manager->read($imageData);

            $resized = $img
                ->scaleDown($width)
                ->cover($width, $height);

            $fullPath = storage_path("app/public/products/{$movieId}/{$type}.webp");

            if (file_exists($fullPath)) {
                unlink($fullPath);
            }

            $resized->encode(new WebpEncoder(quality: 75))
                ->save($fullPath);

            $paths[$type] = "products/{$movieId}/{$type}.webp";
        }

        // Blur placeholder
        $blur = $this->manager->read($imageData)
            ->scaleDown(20)
            ->blur(15);

        $blurFullPath = storage_path("app/public/products/{$movieId}/blur.webp");

        if (file_exists($blurFullPath)) {
            unlink($blurFullPath);
        }

        $blur->encode(new WebpEncoder(quality: 50))
            ->save($blurFullPath);

        $paths['blur'] = "products/{$movieId}/blur.webp";

        return $paths;
    }

    /**
     * Delete a file from public storage if it exists.
     *
     * @param string|null $path
     * @return void
     */
    public function deleteIfExists($path) {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
