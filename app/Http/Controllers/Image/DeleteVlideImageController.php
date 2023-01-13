<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\UploadAudioRequest;
use App\Services\VlideService;
use Illuminate\Support\Str;
use App\Models\Vlide;
use App\Models\Image;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class DeleteVlideImageController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)  // Single Action Controller
    {
        $image_id = $request->route('imageId');
        $vlide_id = $request->route('vlideId');
        
        $user_id = $request->user()->id;

        $image = Image::where('id', $image_id)->firstOrFail();
        $vlide = Vlide::where('id', $vlide_id)->firstOrFail();

        if($image->user_id !== $user_id) {
            throw new AccessDeniedException();
        }
        
        $target = DB::transaction(function () use($image, $vlide) {

            if($image->name){
                $filePath = 'public/images/'.$image->name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                // if(Storage::exists($filePath)) {
                    // Storage::delete($filePath);
                    Storage::disk('s3')->delete($filePath);

                }

                if($vlide->header_file_name === $image->name) {
                    $vlide->header_file_name = null;
                    $vlide->save();
                }

                $image->delete();
            }

            return $filePath;
        });

        return response()->json([
        ], 204);
    }
    
}