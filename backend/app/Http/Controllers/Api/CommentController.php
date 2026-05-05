<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Services\CommentService;

class CommentController extends Controller {

    /**
     * Return all comments for a specific product.
     *
     * This endpoint:
     * - retrieves comments with user metadata
     * - returns them in descending chronological order
     * - is used by the React ProductPage to render the comment thread
     *
     * @param Product $product
     * @param CommentService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Product $product, CommentService $service) {
        return response()->json(
            $service->getCommentsForProduct($product)
        );
    }

    /**
     * Store a new comment for a product.
     *
     * Validation:
     * - content: required, max 1000 chars
     *
     * The method supports both authenticated and guest users.
     * Authenticated users will have their user_id attached automatically.
     *
     * @param Request $request
     * @param int $id  Product ID
     * @param CommentService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, int $id, CommentService $service) {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = $service->createComment($id, $request->content);

        return response()->json($comment, 201);
    }

    /**
     * Update an existing comment.
     *
     * Validation:
     * - body: required, max 1000 chars
     *
     * This endpoint is used by the React frontend to allow users
     * to edit their own comments.
     *
     * @param Request $request
     * @param Comment $comment
     * @param CommentService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Comment $comment, CommentService $service) {
        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $updated = $service->updateComment($comment, $request->body);

        return response()->json([
            'success' => true,
            'comment' => $updated
        ]);
    }

    /**
     * Delete a comment.
     *
     * This endpoint:
     * - removes the comment from the database
     * - is typically used by the user who created the comment
     *   or by an admin in the panel
     *
     * @param Comment $comment
     * @param CommentService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Comment $comment, CommentService $service) {
        $service->deleteComment($comment);

        return response()->json([
            'success' => true
        ]);
    }
}
