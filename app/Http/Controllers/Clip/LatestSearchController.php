<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipResource;


class LatestSearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        // $tag_name = $request->route('tag_name');
        $word = $request->word;
        $per_page = 12;
        
        $since = $request->since;
        $clips = $clipService->getSearch($word, $per_page, $since);

        return [
            'count'=>$clips->count(),
            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?word=".$word."&since=".$clips[count($vlides)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => ClipResource::collection($clips->take($per_page)),
            // 'w' => $word,
        ];
    }
}
