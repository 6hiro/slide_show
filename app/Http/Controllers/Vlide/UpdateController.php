<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\UpdateRequest;

use App\Models\Vlide;
use App\Services\VlideService;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class UpdateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UpdateRequest $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');
        if( !$vlideService->checkOwnVlide($request->user()->id, $vlideId) ){
            throw new AccessDeniedException();
        }

        $vlide_id = $vlideService->updateVlide(
            $vlideId,
            $request->title(),
            $request->content(),
            $request->duration(),
            $request->is_public(),
            $request->tag_list(),
            // $request->images(),
        );

        return response()->json([
            'id' => $vlideId,
            'status'=>'success',
        ], 201);

    }
}
