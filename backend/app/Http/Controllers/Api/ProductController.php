<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller {

    /**
     * Return a list of all products with related images and categories.
     *
     * This endpoint is consumed by the React frontend to render:
     * - product grids
     * - category pages
     * - search results
     *
     * The method:
     * - eager loads images and categories
     * - sorts products by creation date (newest first)
     *
     * @return \Illuminate\Database\Eloquent\Collection<Product>
     */
    public function index() {
        return Product::with(['images', 'categories'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Return a single product with full relational data.
     *
     * Loaded relations:
     * - images (responsive variants)
     * - categories
     * - comments with user metadata
     *
     * This endpoint powers the React ProductPage view.
     *
     * @param Product $product
     * @return Product
     */
    public function show(Product $product) {
        $product->load([
            'images',
            'categories',
            'comments.user'
        ]);

        return $product;
    }

    /**
     * Return the top 10 most‑voted products with images.
     *
     * This endpoint is used by the React frontend to display
     * the hero/featured slider on the homepage.
     *
     * Rules:
     * - only products that have images
     * - sorted by vote count (descending)
     * - limited to 10 items
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function hero() {
        $products = Product::with('images')
            ->whereHas('images')
            ->orderBy('votes', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'products' => $products
        ]);
    }
}
