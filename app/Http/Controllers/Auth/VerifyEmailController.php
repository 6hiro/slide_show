<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
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
    public function __invoke(EmailVerificationRequest $request)
    {
        // https://stackoverflow.com/questions/52866689/laravel-5-6-signed-url-wont-work-in-app-env-production
        // if (!$request->hasValidSignature()) {
        //     return response()->json(["message" => "Invalid/Expired url provided."], 401);
        // }

        $user = User::findOrFail($request->->route("id"));
    
        // if ($request->user()->hasVerifiedEmail()) {
        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(
                config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
            );
        }

        if ($user->markEmailAsVerified()) {
        // if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(
            config('app.frontend_url').RouteServiceProvider::HOME.'?verified=1'
        );
    }
}