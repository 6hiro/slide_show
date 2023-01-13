<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Requests\User\UploadImageRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateIconController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UploadImageRequest $request)
    {
        $user = User::find(Auth::id());

        if(!$user) {
            return response()->json([], 500);
        }

        $image = $request->file('image');
        $file_name = Str::random(32).".".$image->getClientOriginalExtension();

        $target =  DB::transaction(function () use($user, $image, $file_name) {
            if($user->file_name){
                $filePath = 'public/images/'.$user->file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }

            $path = Storage::disk('s3')->putFileAs('public/images', $image, $file_name);

            $user->file_name = $file_name;
            $user->save();

            return $file_name;
        });

        return $target
            ? response()->json([
                    'file_path' => $target,
                    'user_id'=>$user->id,
                ])
            : response()->json([], 500);
    }
}
