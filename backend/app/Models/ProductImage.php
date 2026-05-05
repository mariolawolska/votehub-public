<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model {

    /**
     * Mass‑assignable fields for the ProductImage model.
     *
     * Represents a single image variant associated with a product.
     * Each image record stores:
     * - type (thumb, xl, poster, etc.)
     * - file path
     * - dimensions
     * - format (jpg, webp, png)
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'type',
        'path',
        'width',
        'height',
        'format',
    ];

    /**
     * Get the product that this image belongs to.
     *
     * Relationship:
     * - A product can have many images
     * - An image always belongs to exactly one product
     *
     * Used for:
     * - admin uploads
     * - image galleries
     * - thumbnail resolution logic in Product model
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product() {
        return $this->belongsTo(Product::class);
    }

    /**
     * Automatically append the full public URL to the model.
     *
     * This ensures that API and admin panel always receive
     * a ready‑to‑use URL instead of a raw storage path.
     *
     * @var array<int, string>
     */
    protected $appends = ['full_url'];

    /**
     * Get the full public URL for the stored image.
     *
     * Converts the internal storage path into a full asset URL.
     *
     * Used by:
     * - Product::getThumbnailUrlAttribute()
     * - admin search results
     * - React frontend
     *
     * @return string
     */
    public function getFullUrlAttribute() {
        return asset('storage/' . $this->path);
    }
}
