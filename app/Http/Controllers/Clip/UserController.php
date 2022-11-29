<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use App\Services\ClipService;
use Illuminate\Http\Request;
// use App\Models\Vlide
use App\Http\Resources\ClipResource;



class UserController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)  // Single Action Controller
    {
        $per_page = 5;
        $since = $request->since;
        $user_id = $request->route('userId');
        // $user_id = $request->user()->id;

        $clips = $clipService->getUserClips($user_id, $per_page, $since);

        return [
            'a' => $clips,

            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
