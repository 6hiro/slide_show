<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;

use App\Models\User;
use App\Models\Vlide;
use App\Services\VlideService;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class DeleteAccountController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *
     */
    public function __invoke(Request $request, VlideService $vlideServic)
    {
        $user = $request->user();

        $audio_file_names = array_filter( 
            $user->vlides()->get()->pluck("audio_file_name")->toArray() 
        );

        DB::transaction(function () use($user, $audio_file_names) {

            foreach($audio_file_names as $audio_file_name){
                $filePath = 'public/audios/'.$audio_file_name;

                if(Storage::exists($filePath)) {
                    Storage::delete($filePath);
                }
            }
            
            $user->delete();
        });

        // return response()->json($user->id);


        // return $user->delete()
        //     ? response()->json($user)
        //     : response()->json([], 500);
    }
}