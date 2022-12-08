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
        $vlide_count = $vlideService->getUserVlideCount(
            $request->user()->id
        );
        if($vlide_count >= 4)
        {
            return response()->json([
                    'count' => $vlide_count,
                    'status'=>'over',
                ], 403);
        }

        $vlide_id = $vlideService->create(
            $request->user()->id,
            $request->title(),
            $request->tag_list(),
            $request->is_public(),
        );

        return response()->json([
                'id' => $vlide_id,
                'status'=>'success',
                // 'a' => $vlide_count
            ], 201);
            
    }
}
