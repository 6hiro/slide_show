<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\UploadImageRequest;
use App\Models\Image;
// use App\Http\Resources\VlideResource;
use Illuminate\Support\Str;
use App\Models\Vlide;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Validator;


class UploadVlideImageController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function __invoke(Request $request)  // Single Action Controller
    public function __invoke(UploadImageRequest $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');
        $image = $request->file('image');
        $is_public = false;
        $user_id = $request->user()->id;

        $vlide = Vlide::where('id', $vlideId)->firstOrFail();

        if($vlide->count_images >= 4){ // 4 つまで
            return response()->json([
                'count' => $vlide->count_images,
                'message'=>'over',
            ], 403);
        }


        $file_name = Str::random(32).".".$image->getClientOriginalExtension();

        $target =  DB::transaction(function () use($user_id, $vlide, $image, $file_name, $is_public) {

            $imageModel = Image::create([
                'name' => $file_name,
                'is_public' => $is_public,
                'user_id' => $user_id
            ]);


            $path = Storage::disk('s3')->putFileAs('public/images', $image, $file_name);

            $vlide->images()->attach($imageModel->id);
            
            // $vlide->header_file_name = $file_name;
            // $vlide->save();

            return $imageModel;
        });


    
        return response()->json([
            'id'=> $target->id,
            'filePath' => $target->name,
            'filePath' => $file_name
        ], 201);
    }
}
