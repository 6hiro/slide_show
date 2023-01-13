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
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;


class SetVlideHeaderController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    // public function __invoke(Request $request)  // Single Action Controller
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');

        // return response()->json([
        //     'r' => $vlideId
        // ], 201);

        // $is_public = $request->is_public();
        $user_id = $request->user()->id;
        $vlide = Vlide::where('id', $vlideId)->firstOrFail();


        if($vlide->user_id !== $user_id) {
            throw new AccessDeniedException();
        }
        
        $imageId = $request->route('imageId');

        $image = Image::where('id', $imageId)->firstOrFail();

        if($image->name === $vlide->header_file_name ) {
            $vlide->header_file_name = null;
            $vlide->save();
        } else {
            $vlide->header_file_name = $image->name;
            $vlide->save();
        }
        



        return response()->json([
            'url' => '/api/v1/image?f='.$vlide->header_file_name
        ], 201);
    }
}
