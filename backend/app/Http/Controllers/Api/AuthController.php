<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Authenticate a user using email and password.
     *
     * Workflow:
     * - validate credentials
     * - attempt login using the JWT guard
     * - return a JWT token and user payload on success
     *
     * Response:
     * {
     *   "token": "jwt-token",
     *   "user": { ... }
     * }
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => auth('api')->user()
        ]);
    }

    /**
     * Register a new user and return a JWT token.
     *
     * Validation:
     * - name: required
     * - email: unique
     * - password: min 6, must be confirmed
     *
     * After creating the user, the method:
     * - logs them in automatically
     * - returns a JWT token and user payload
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = \App\Models\User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * Return the currently authenticated JWT user.
     *
     * Used by the React frontend to:
     * - restore session state
     * - fetch user profile data
     *
     * @return \App\Models\User|null
     */
    public function user()
    {
        return auth('api')->user();
    }

    /**
     * Invalidate the current JWT token.
     *
     * This logs the user out by:
     * - invalidating the token server-side
     * - preventing further access until a new login
     *
     * @return array<string,string>
     */
    public function logout()
    {
        auth('api')->logout();
        return ['message' => 'Logged out'];
    }
}
