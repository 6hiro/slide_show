<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ClipResource;
use App\Services\ClipService;


class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        //
        $per_page = 12;
        $since = $request->since;
        $clips = $clipService->getClips($per_page, $since);

        return [
            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => VlideResource::collection($clips->take($per_page)),
            // 'data' => $vlides->take($per_page),
        ];
    }
}
