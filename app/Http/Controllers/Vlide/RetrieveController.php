<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VlideService;
use App\Http\Resources\VlideResource;

class RetrieveController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        //
        $vlideId = $request->route('vlideId');
        $vlide =  $vlideService->retriveVlide($vlideId);

        if($vlide->is_public) {
            return response()
                ->json(
                    new VlideResource( $vlide )
                );
        }
        else {
            return response()->json();
        }

        // return response()
        //     ->json($vlide);
            // ->header('Content-Type', 'audio/mpeg')
            // ->header('Content-Range', 'bytes 3244032-8945228/8945229')
            // ->header('Content-Length', '905357')
            // ->header('Accept-Ranges', 'bytes');
            // ->header('accept-ranges', 'bytes');
    }
}
