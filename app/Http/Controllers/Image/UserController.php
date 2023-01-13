<?php

namespace App\Http\Controllers\Image;

use App\Http\Controllers\Controller;
use App\Services\ImageService;
use Illuminate\Http\Request;
// use App\Models\Vlide
use App\Http\Resources\ImageResource;



class UserController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ImageService $imageService)  // Single Action Controller
    {
        $per_page = 12;
        $since = $request->since;
        $user_id = $request->route('userId');
        // $user_id = $request->user()->id;

        $images = $imageService->getUserImages($user_id, $per_page, $since);

        return [
            // 'a' => $images,

            'next_page_link'=>$images->count()>$per_page 
                ? $request->url()."?since=".$images[count($images)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => ImageResource::collection($images->take($per_page)),
        ];
    }
}
