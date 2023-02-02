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
        // return response()->json();

        $audio_file_names = array_filter( 
            $user->vlides()->get()->pluck("audio_file_name")->toArray() 
        );

        $book_img_file_names = array_filter( 
            $user->books()->get()->pluck("img_file_name")->toArray() 
        );
        
        $image_names = array_filter(
            $user->images()->pluck("name")->toArray()
        );


        $target = DB::transaction(function () use($user, $audio_file_names, $book_img_file_names, $image_names) {
            
            if($user->file_name){
                $filePath = 'public/images/'.$user->file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }
            
            if($image_names) {
                foreach($image_names as $image_name){
                    $filePath = 'public/images/'.$image_name;
                    if(Storage::disk('s3')->exists($filePath)) {
                        Storage::disk('s3')->delete($filePath);
                    }
                }
            }

            if($book_img_file_names) {
                foreach($book_img_file_names as $book_img_file_name){
                    $filePath = 'public/images/'.$book_img_file_name;
    
                    if(Storage::disk('s3')->exists($filePath)) {
                    // if(Storage::exists($filePath)) {
                        // Storage::delete($filePath);
                        Storage::disk('s3')->delete($filePath);
                    }
                }
            }

            if($audio_file_names) {
                foreach($audio_file_names as $audio_file_name){
                    $filePath = 'public/audios/'.$audio_file_name;
    
                    if(Storage::disk('s3')->exists($filePath)) {
                    // if(Storage::exists($filePath)) {
                        // Storage::delete($filePath);
                        Storage::disk('s3')->delete($filePath);
                    }
                }
            }

            
            return $user->delete();
        });

        return $target
            ? response()->json()
            : response()->json([], 500);
    }
}