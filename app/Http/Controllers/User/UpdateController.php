<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Resources\UserResource;
// use App\Services\ClipService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UpdateController extends Controller
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
            'nick_name'=>'required|max:40',
            'description'=>'max:160',
        ]);

        if($validator->fails())
        {
            return response()->json([
                'status'=>419,
                'validation_errors'=>$validator->messages(),
            ]);
        }

        $user = User::find(Auth::id());

        $user->nick_name = $request->nick_name;
        $user->description = $request->description;
        $user->save();

        return $user
        ? response()->json([
                'nick_name'=>$user->nick_name,
                'description'=>$user->description,
                'user_id'=>$user->id,
            ])
        : response()->json([], 500);

    }
}
