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

class DeleteAccountController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();

        // if($user->delete()){
        //     return redirect()->route('home');
        // }
        // return response()->json([], 500);

        return $user->delete()
            ? response()->json($user)
            : response()->json([], 500);
    }
}