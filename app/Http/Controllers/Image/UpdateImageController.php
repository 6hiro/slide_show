<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\UploadImageRequest;
use App\Models\Image;
use Illuminate\Support\Str;
use App\Models\Vlide;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class UpdateImageController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $imageId = $request->route('imageId');
        $user_id = $request->user()->id;

        $image = Image::where('id', $imageId)->firstOrFail();

        if($image->user_id !== $user_id) {
            throw new AccessDeniedException();
        }

        $is_public = $request->is_public;

        $image->is_public = $is_public;
        $image->save();
        

        return response()->json([
            'is_public' => $image->is_public
        ], 201);
    }
}
