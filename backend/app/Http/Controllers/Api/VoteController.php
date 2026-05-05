<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VoteService;
use App\Models\Vote;

class VoteController extends Controller {

    /**
     * Handle voting from the React client (JWT authentication).
     *
     * This endpoint:
     * - validates the JWT-authenticated user
     * - delegates vote logic to VoteService
     * - returns a normalized JSON response with status codes
     *
     * @param int $id  Product ID
     * @param VoteService $service
     * @return \Illuminate\Http\JsonResponse
     */
    public function voteApi(int $id, VoteService $service) {
        $user = auth('api')->user(); // JWT guard

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $result = $service->vote($id, $user);

        return response()->json($result, $result['status']);
    }

    /**
     * Handle voting from the admin panel (session-based authentication).
     *
     * This endpoint:
     * - uses the web guard (session)
     * - delegates vote logic to VoteService
     * - redirects back with flash messages
     *
     * @param int $id  Product ID
     * @param VoteService $service
     * @return \Illuminate\Http\RedirectResponse
     */
    public function voteWeb(int $id, VoteService $service) {
        $user = auth()->user(); // web guard (session)

        if (!$user) {
            return redirect()->back()->with('error', 'Not authenticated');
        }

        $service->vote($id, $user);

        return redirect()->back()->with('success', 'Vote updated');
    }

    /**
     * Check if the authenticated JWT user has already voted for a product.
     *
     * Returns:
     * - hasVoted: true/false
     *
     * This endpoint is used by the React client to disable the vote button
     * and prevent duplicate submissions.
     *
     * @param int $id  Product ID
     * @return \Illuminate\Http\JsonResponse
     */
    public function check(int $id) {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['hasVoted' => false]);
        }

        $voted = Vote::where('user_id', $user->id)
            ->where('product_id', $id)
            ->exists();

        return response()->json(['hasVoted' => $voted]);
    }
}
