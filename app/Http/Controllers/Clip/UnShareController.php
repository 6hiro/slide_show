<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;

class UnShareController extends Controller
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
        $clip_id = $request->route('clip_id');

        if( !$clipService->checkOwnClip($request->user()->id, $clip_id) ){
            throw new AccessDeniedException();
        }

        $result = $clipService->unshare(
            $clip_id,
        );
        return $result;
    }
}
