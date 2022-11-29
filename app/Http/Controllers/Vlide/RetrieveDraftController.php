<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VlideService;
use App\Http\Resources\VlideResource;

class RetrieveDraftController extends Controller
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

        if($vlide->user_id === $request->user()->id) {
            return response()
                ->json(
                    new VlideResource( $vlide )
                );
        }
        else {
            return response()->json();
        }
    }
}
