<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Resources\UserResource;
// use App\Services\ClipService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ChangeUserNameController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {        
        $validator = Validator::make($request->all(),[
            'name'=>'required|string|max:255|unique:users',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }

        $user = User::find(Auth::id());

        $user->name = $request->name;
        $user->save();

        return $user
        ? response()->json([
                'nick_name'=>$user->nick_name,
            ])
        : response()->json([], 500);

    }
}
