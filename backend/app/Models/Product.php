<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {

    /**
     * Mass‑assignable fields for the Product model.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'url',
        'votes',
        'trailerUrl',
    ];

    /**
     * Get all comments associated with the product.
     *
     * Ordered by newest first.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function comments() {
        return $this->hasMany(Comment::class)->latest();
    }

    /**
     * Get all votes associated with the product.
     *
     * Used for counting and checking user voting status.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function votes() {
        return $this->hasMany(Vote::class);
    }

    /**
     * Get all categories assigned to the product.
     *
     * Many‑to‑many relationship.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function categories() {
        return $this->belongsToMany(Category::class);
    }

    /**
     * Get all images associated with the product.
     *
     * Includes thumbnails, posters, and other variants.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images() {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get a specific image by type (e.g. 'thumb', 'poster').
     *
     * @param string $type
     * @return string|null  Path to the image or null if not found
     */
    public function image($type) {
        return $this->images()->where('type', $type)->first()?->path;
    }

    /**
     * Resolve the thumbnail URL for the product.
     *
     * Priority:
     * 1. Admin‑uploaded images stored in the database (preferred)
     * 2. External full URLs (e.g. TMDB)
     * 3. Local file paths converted to public URLs
     * 4. Fallback placeholder image
     *
     * @return string
     */
    public function getThumbnailUrlAttribute() {
        // Prefer images stored in the database (admin uploads)
        if ($this->images && $this->images->count()) {
            $thumb = $this->images->where('type', 'thumb')->first();
            return $thumb->full_url ?? $this->images->first()->full_url;
        }

        // If the thumbnail is already a full external URL (e.g. TMDB)
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }

        // If it's a local file path, convert it to a public URL
        if ($this->thumbnail) {
            return Storage::url($this->thumbnail);
        }

        // Fallback placeholder
        return '/placeholder.jpg';
    }
}
