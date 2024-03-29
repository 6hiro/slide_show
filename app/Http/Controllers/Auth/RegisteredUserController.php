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
use Illuminate\Support\Facades\DB;

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
            'name' => ['required', 'string', 'max:20', 'unique:users', 'regex:/^[0-9a-zA-Z_]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            // confirmed: password_confirmationと同値であるか否か
            'password' => ['required', 'confirmed', Rules\Password::defaults()], 
        ]);
        // $username_pattern ='/^[0-9a-zA-Z_]+$/';
        // if(preg_match($username_pattern, $request->name,)) {}

        $user_name = DB::select('select * from users where UPPER(name) = ? ', [strtoupper($request->name)]);
        // $user_name = DB::select('select * from users where name = ? COLLATE utf8mb4_unicode_ci', [$request->name]);
        // $user_email = DB::select('select * from users where email = ? COLLATE utf8mb4_unicode_ci', [$request->email]);
        $user_email = DB::select('select * from users where UPPER(email) = ? ', [strtoupper($request->email)]);


        if($user_name) return ['status' =>"name.validation.unique"];
        if($user_email) return ['status' =>'email.validation.unique'];


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