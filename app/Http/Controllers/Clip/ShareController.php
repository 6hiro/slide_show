<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipResource;

class ShareController extends Controller
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
        $parent_id = $request->route('parent_id');

        $clip_count = $clipService->getUserClipCount($user_id);
        
        if($clip_count >= 20)
        {
            return response()->json([
                    'count' => $clip_count,
                    'status'=>'over',
                ], 403);
        }
        

        $clip = $clipService->share(
            $user_id,
            $parent_id
        );

        return new ClipResource($clip);
    }
    // public function unshareClip(Request $request, Clip $clip)
    // {
    //     if($request->user()->id !== $clip->user_id)
    //     {
    //         return response()->json([], 401);
    //     }
    //     else
    //     {
    //         return $clip->delete()
    //             ? response()->json($clip)
    //             : response()->json([], 500);
    //     }  
    // }
}
