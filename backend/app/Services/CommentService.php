<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Comment;
use Illuminate\Support\Facades\Auth;

class CommentService
{
    /**
     * Retrieve all comments for a given product.
     *
     * The method:
     * - selects only required fields
     * - loads the user relationship (id, name)
     * - orders comments by creation date (newest first)
     *
     * @param Product $product
     * @return \Illuminate\Database\Eloquent\Collection<Comment>
     */
    public function getCommentsForProduct(Product $product)
    {
        return $product->comments()
            ->select('id', 'product_id', 'user_id', 'content as body', 'created_at')
            ->with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Create a new comment for a product.
     *
     * The method supports both authenticated and guest users.
     * If the user is logged in, their ID is attached automatically.
     *
     * @param int $productId
     * @param string $content
     * @return Comment
     */
    public function createComment(int $productId, string $content): Comment
    {
        return Comment::create([
            'product_id' => $productId,
            'user_id' => Auth::id(), // may be null for guests
            'content' => $content,
        ]);
    }

    /**
     * Update an existing comment.
     *
     * @param Comment $comment
     * @param string $content
     * @return Comment
     */
    public function updateComment(Comment $comment, string $content): Comment
    {
        $comment->content = $content;
        $comment->save();

        return $comment;
    }

    /**
     * Delete a comment.
     *
     * @param Comment $comment
     * @return bool
     */
    public function deleteComment(Comment $comment): bool
    {
        return $comment->delete();
    }
}
