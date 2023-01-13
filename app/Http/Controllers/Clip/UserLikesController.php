<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipResource;

class UserLikesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        $per_page = 12;
        // $user_id = $request->user()->id;
        $user_id = $request->route('userId');

        $since = $request->since;

        $clips = $clipService->getLikes($user_id, $per_page, $since);

        // dd($clips);

        return [
            'next_page_link' => $clips->count() > $per_page
                ? $request->url()."?since=".$clips[count($clips)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
