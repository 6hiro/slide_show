<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;

class DeleteController extends Controller
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
        $clipId = $request->route('clipId');

        if( !$clipService->checkOwnClip($request->user()->id, $clipId) ){
            throw new AccessDeniedException();
        }
        
        $clipService->delete($clipId);
        
        return response()->json($clipId);
    }
}
