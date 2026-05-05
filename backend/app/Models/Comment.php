<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model {

    /**
     * Mass‑assignable fields for the Comment model.
     *
     * @var array<int, string>
     */
    protected $fillable = ['product_id', 'user_id', 'content'];

    /**
     * Get the product that this comment belongs to.
     *
     * Relationship:
     * - A product can have many comments
     * - A comment always belongs to exactly one product
     *
     * Used for:
     * - fetching comments on ProductPage
     * - admin moderation
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product() {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the user who created the comment.
     *
     * Relationship:
     * - A user can create many comments
     * - A comment belongs to exactly one user (or null if guest)
     *
     * Used for:
     * - displaying author name
     * - permissions (edit/delete)
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user() {
        return $this->belongsTo(User::class);
    }
}
