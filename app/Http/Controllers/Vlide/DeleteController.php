<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VlideService;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class DeleteController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');

        if( !$vlideService->checkOwnVlide($request->user()->id, $vlideId) ){
            throw new AccessDeniedException();
        }
        $vlideService->deleteVlide($vlideId);
        // return $vlide->delete()
        
        return response()->json($vlideId);
    }
}
