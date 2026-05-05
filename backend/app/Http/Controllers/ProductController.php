<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Services\ProductService;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;

class ProductController extends Controller {

    private ProductService $service;

    /**
     * Inject ProductService to delegate all business logic.
     *
     * The controller remains thin and focused on:
     * - rendering Blade views
     * - handling form submissions
     * - redirecting with flash messages
     *
     * All domain logic (CRUD, image handling, categories, search)
     * is encapsulated inside ProductService.
     */
    public function __construct(ProductService $service) {
        $this->service = $service;
    }

    /**
     * Display a paginated list of products for the admin panel.
     *
     * Used by:
     * - /admin/products
     * - product management dashboard
     *
     * @return \Illuminate\View\View
     */
    public function index() {
        $products = $this->service->getPaginated();
        return view('products.index', compact('products'));
    }

    /**
     * Show the form for creating a new product.
     *
     * Loads all categories for the multi-select input.
     *
     * @return \Illuminate\View\View
     */
    public function create() {
        return view('products.create', [
            'categories' => Category::all()
        ]);
    }

    /**
     * Store a newly created product in the database.
     *
     * Validation is handled by StoreProductRequest.
     * ProductService handles:
     * - saving product data
     * - assigning categories
     * - processing uploaded images
     *
     * @param StoreProductRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreProductRequest $request) {
        $this->service->create($request);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing an existing product.
     *
     * Loads:
     * - product data
     * - all categories
     * - existing category assignments
     *
     * @param Product $product
     * @return \Illuminate\View\View
     */
    public function edit(Product $product) {
        return view('products.edit', [
            'product' => $product,
            'categories' => Category::all()
        ]);
    }

    /**
     * Update an existing product in the database.
     *
     * Validation is handled by UpdateProductRequest.
     * ProductService handles:
     * - updating product fields
     * - syncing categories
     * - replacing images if uploaded
     *
     * @param UpdateProductRequest $request
     * @param Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateProductRequest $request, Product $product) {
        $this->service->update($request, $product);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Delete a product from the database.
     *
     * ProductService handles:
     * - deleting product record
     * - removing associated images
     * - cleaning up storage directories
     *
     * @param Product $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Product $product) {
        $this->service->delete($product);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Search for products by title or description.
     *
     * Used by the admin panel's AJAX search bar.
     * Returns JSON formatted specifically for the Alpine.js table.
     *
     * Response includes:
     * - id
     * - title
     * - description
     * - votes
     * - comments_count
     * - categories
     * - productUrl (accessor)
     * - thumbnail_url (accessor)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function search() {
        $query = request('q');

        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $results = $this->service->search($query);

        $mapped = $results->map(function ($product) {
            return [
                'id' => $product->id,
                'title' => $product->title,
                'description' => $product->description,
                'votes' => $product->votes,
                'comments_count' => $product->comments_count,
                'categories' => $product->categories,
                'productUrl' => $product->url,
                'thumbnail_url' => $product->thumbnail_url,
            ];
        });

        return response()->json($mapped);
    }

    /**
     * Display a single product in the admin panel.
     *
     * @param Product $product
     * @return \Illuminate\View\View
     */
    public function show(Product $product) {
        return view('products.show', compact('product'));
    }
}
