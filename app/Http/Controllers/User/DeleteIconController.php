<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class DeleteIconController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user = $request->user();

        if(!$user) {
            return response()->json([], 500);
        }
        
        $target = DB::transaction(function () use($user) {

            if($user->file_name){
                $filePath = 'public/images/'.$user->file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }
            
            $user->file_name = null;
            $user->save();

            return $user->id;
        });

        return response()->json([
        ], 204);
    }
}
