<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipWithReplyResource;


class RetrieveController extends Controller
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
        $clip_id = $request->route('clipId');
        // $vlide =  new VlideResource( $vlideService->retriveVlide($vlideId) );
        $clip =  $clipService->retrive($clip_id);


        return new ClipWithReplyResource($clip);

        // return [
        //     'next_page_link'=>$clips->count()>$per_page 
        //         ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]
        //         : null,
        //     'data' => ClipResource::collection($clips->take($per_page)),
        // ];

        // return response()->json(
            // $clip->reclips()->pluck('id')->toArray(),
            // $clip->replies->pluck('id')->toArray()
        // );
    }

}
