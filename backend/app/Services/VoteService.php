<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Vote;
use Illuminate\Support\Facades\Auth;

class VoteService {

    /**
     * Register a vote for a given product.
     *
     * This method encapsulates the complete voting workflow:
     * - validates authentication status
     * - verifies that the product exists
     * - prevents duplicate votes from the same user
     * - stores a new Vote record
     * - increments the product's vote counter
     *
     * The method returns a normalized response array used by both
     * API controllers (JWT) and web controllers (session-based).
     *
     * @param int $productId  The ID of the product being voted for.
     * @return array{
     *     success: bool,
     *     status: int,
     *     message: string,
     *     votes?: int
     * }
     */
    public function vote(int $productId): array {
        $user = auth()->user();

        if (!$user) {
            return [
                'success' => false,
                'status' => 401,
                'message' => 'You must be logged in to vote'
            ];
        }

        $product = Product::find($productId);

        if (!$product) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Product not found'
            ];
        }

        // Check if user already voted
        $already = Vote::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->exists();

        if ($already) {
            return [
                'success' => false,
                'status' => 409,
                'message' => 'You have already voted for this product'
            ];
        }

        // Register vote
        Vote::create([
            'user_id' => $user->id,
            'product_id' => $productId
        ]);

        // Increment counter
        $product->votes++;
        $product->save();

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Vote registered successfully',
            'votes' => $product->votes
        ];
    }

    /**
     * Retrieve all products.
     *
     * Legacy method used by older endpoints.
     * Modern API consumers should rely on dedicated Product controllers.
     *
     * @return \Illuminate\Database\Eloquent\Collection<Product>
     */
    public function getAllProducts() {
        return Product::all();
    }
}
