<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Clip\CreateRequest;

use App\Services\ClipService;

class CreateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(CreateRequest $request, ClipService $clipService)
    {
        // $vlide_id = $request->route('vlideId');
        $is_public = true;
        $content = $request->content();
        $quote = $request->quote();

        if(!$content && !$quote) 
        {
            return response()->json([
                'status'=>'need content or quote',
            ], 403);
        }

        $clip_count = $clipService->getUserClipCount(
            $request->user()->id
        );
        if($clip_count >= 20) {
            return response()->json([
                    'count' => $clip_count,
                    'status'=>'over',
                ], 403);
        }

        $vlide_id = $clipService->create(
            $request->user()->id,
            $request->route('vlideId'),
            $is_public,
            $content,
            $quote,
        );

        return response()->json([
                'id' => $vlide_id,
                'status'=>'success',
            ], 201);
         
    }
}
