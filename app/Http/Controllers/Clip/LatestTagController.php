<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipResource;

class LatestTagController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        $tag_name = $request->tag_name;

        $per_page = 12;
        $since = $request->since;
        $clips = $clipService->getTag($tag_name, $per_page, $since);

        return [
            'next_page_link'=>$clips->count()>$per_page 
                // ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]
                ? $request->url()."?tag_name=".$tag_name."&since=".$clips[count($clips)-2]["created_at"]

                : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
