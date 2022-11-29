<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\CreateRequest;
use App\Services\VlideService;


class CreateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\CreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(CreateRequest $request, VlideService $vlideService)
    {
        $vlide_id = $vlideService->create(
            $request->user()->id,
            $request->title(),
            $request->tag_list(),
            $request->is_public(),
        );

        return response()->json([
                'id' => $vlide_id,
                'status'=>'success',
            ], 201);
            
    }
}
