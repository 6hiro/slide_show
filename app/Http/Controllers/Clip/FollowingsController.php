<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Clip;
use App\Http\Resources\ClipResource;
use Illuminate\Support\Facades\Auth;
use App\Services\ClipService;

class FollowingsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        $user_id = $request->user()->id;
        $per_page = 12;
        $since = $request->since;

        $clips = $clipService->followings($user_id, $per_page, $since);

        return [
            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
