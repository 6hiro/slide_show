<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Clip\ReplyRequest;
use App\Http\Resources\ClipResource;

use App\Services\ClipService;

class AddReplyController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(ReplyRequest $request, ClipService $clipService)
    {
        $is_public = true;

        $clip_count = $clipService->getUserClipCount(
            $request->user()->id
        );
        if($clip_count >= 30)
        {
            return response()->json([
                    'count' => $clip_count,
                    'status'=>'over',
                ], 403);
        }

        // return $request->content();
        $clip = $clipService->addReply(
            $request->user()->id,
            $request->route('clipId'),
            $is_public,
            $request->content(),
            // $request->quote(),
        );
        return new ClipResource($clip);

    }
}
