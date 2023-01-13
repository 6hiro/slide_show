<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
// use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Models\User;

// use DateTime;
// use DateTimeZone;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     *
     * @param  \Illuminate\Foundation\Auth\EmailVerificationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    // public function __invoke(EmailVerificationRequest $request)
    public function __invoke(Request $request)
    {
        // https://stackoverflow.com/questions/52866689/laravel-5-6-signed-url-wont-work-in-app-env-production
        // if (!$request->hasValidSignature()) {
        //     return response()->json(["message" => "Invalid/Expired url provided."], 401);
        // }

        $user = User::findOrFail($request->route("id"));
        
        if ($user->hasVerifiedEmail()) {
        // if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(
                config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            );
        }

        // if ($user->markEmailAsVerified()) {
        //     // event(new Verified($user));
            
        // // if ($request->user()->markEmailAsVerified()) {
        //     // event(new Verified($request->user()));
        // }

        $user->markEmailAsVerified();

        return redirect()->intended(
            config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        );
    }
}