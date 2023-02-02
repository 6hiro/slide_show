<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;

use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Mail\NewUserIntroduction;
use Illuminate\Contracts\Mail\Mailer;
use App\Services\UserService;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request, Mailer $mailer, UserService $userService)
    {
        $user_count = $userService->getUserCount();
        if($user_count >= 500)
        {
            return response()->json([
                    'count' => $user_count,
                    'status'=>'over',
                ], 403);
        }
        
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            // confirmed: password_confirmationと同値であるか否か
            'password' => ['required', 'confirmed', Rules\Password::defaults()], 
        ]);

        $user = User::create([
            'name' => $request->name,
            'nick_name'=>'ななしさん',
            'email' => $request->email,
            'description' => '',
            'password' => Hash::make($request->password),
        ]);
        // ->sendEmailVerificationNotification();

        event(new Registered($user));

        // https://readouble.com/laravel/8.x/ja/authentication.html
        Auth::login($user);

        // $mailer->to($user->email)
        //     ->send(new NewUserIntroduction());
        return response()->json(['status' => 'verification-link-sent']);

        // return response()->noContent();
    }
}