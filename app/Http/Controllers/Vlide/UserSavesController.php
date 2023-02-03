<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Vlide\CreateRequest;
use App\Models\Vlide;
use App\Http\Resources\VlideForListResource;
use App\Services\VlideService;


class UserSavesController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\CreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)
    {
        $per_page = 12;
        // $user_id = $request->user()->id;
        $user_id = $request->route('userId');

        if($user_id !== $request->user()->id){
            return response()->json();
        }

        $since = $request->since;

        $vlides = $vlideService->getSaves($user_id, $per_page, $since);

        return [
            // 'a' => $vlides,
            'next_page_link' => $vlides->count() > $per_page
                ? $request->url()."?since=".$vlides[count($vlides)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            // 'data' => VlideResource::collection($vlides->take($per_page)),
            'data' => VlideForListResource::collection($vlides),
        ];


    }
}
