<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
// use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(LoginRequest $request)
    {

        $request->authenticate();

        // email認証済みか検証
        if (!Auth::user()->hasVerifiedEmail()) {
            return response()->json([
                'error'=>'Your email address is not verified.'
            ], 403);
        }

        $request->session()->regenerate();
        
        return response()->noContent();
        // return response()->json([
        //     'user'=>new UserResource(Auth::user()),
        //     'status'=>'success login',
        // ], 200);
    }
    // {
    //     request()->validate([
    //         'email' => ['required', 'string', 'email'],
    //         'password' => ['required'],
    //     ]);

    //     /**
    //      * We are authenticating a request from our frontend.
    //      */
    //     if (EnsureFrontendRequestsAreStateful::fromFrontend(request())) {
    //         $this->authenticateFrontend();
    //     }
    //     /**
    //      * We are authenticating a request from a 3rd party.
    //      */
    //     else {
    //         // Use token authentication.
    //     }
    // }

    // private function authenticateFrontend()
    // {
    //     if (! Auth::guard('web')
    //         ->attempt(
    //             request()->only('email', 'password'),
    //             request()->boolean('remember')
    //         )) {
    //         throw ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }
    // }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();


        // Auth::logout();

        // // セッションを再作成
        // $request->session()->invalidate();
    
        // // CSRFトークンを再作成
        // $request->session()->regenerateToken();
    
        // return response()->json(['status'=>'success logout'], 200);
    }
}