<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\CreateRequest;
use App\Models\Vlide;
use App\Http\Resources\VlideResource;
use App\Services\VlideService;


class SaveUnsaveController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\CreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $vlideId = $request->route('vlideId');

        $result = $vlideService->saveUnsave(
            $request->user(),
            $vlideId
        );

        return $result;


    }
}
