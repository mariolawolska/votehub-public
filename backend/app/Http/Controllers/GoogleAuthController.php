<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Throwable;

class GoogleAuthController extends Controller {

    /**
     * Redirect the user to Google's OAuth consent screen.
     *
     * This method is used by the Laravel admin panel (session-based auth).
     * It triggers the standard Socialite redirect flow.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirect() {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle the OAuth callback for the Laravel admin panel.
     *
     * Workflow:
     * - retrieve Google user data
     * - find or create a matching User record
     * - authenticate using the web guard (session)
     * - redirect to the admin dashboard
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback() {

        try {
            $user = Socialite::driver('google')->user();
        } catch (Throwable $e) {
            return redirect('/')
                ->with('error', 'Google authentication failed.');
        }

        $existingUser = User::where('email', $user->email)->first();

        if ($existingUser) {
            Auth::login($existingUser);
        } else {
            $newUser = User::updateOrCreate(
                ['email' => $user->email],
                [
                    'name' => $user->name,
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now()
                ]
            );

            Auth::login($newUser);
        }

        return redirect('/dashboard');
    }

    /**
     * Redirect the React SPA user to Google OAuth.
     *
     * Uses stateless mode because React does not use Laravel sessions.
     * The redirect URL points to the dedicated React callback route.
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function redirectForReact() {
        return Socialite::driver('google')
            ->stateless()
            ->redirectUrl(route('auth.google.callback.react'))
            ->redirect();
    }

    /**
     * Handle Google OAuth callback for the React SPA.
     *
     * Workflow:
     * - retrieve Google user data (stateless)
     * - create or update the local User record
     * - generate a Sanctum token for the SPA
     * - redirect back to the React app with the token
     *
     * On failure, redirects to the React login page with an error flag.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callbackForReact() {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();
        } catch (Throwable $e) {
            return redirect('https://node.marbar.co.uk/login?error=google_failed');
        }

        $user = User::updateOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]
        );

        // Token for React SPA
        $token = $user->createToken('react-google')->plainTextToken;

        return redirect("https://node.marbar.co.uk/auth/callback?token={$token}");
    }
}
