<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
// use App\Models\Vlide
// use App\Http\Resources\VlideResource;
use App\Http\Resources\VlideForListResource;

use DateTime;
use DateTimeZone;

class RankController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)  // Single Action Controller
    {
        $per_page = 6;

        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        $since = $dateTime->modify('-1 month')->format('Y-m-d H:i:s.v');

        $vlides = $vlideService->getRank($per_page, $since);

        return [
            // 'next_page_link'=>$vlides->count()>$per_page 
            //     ? $request->url()."?since=".$vlides[count($vlides)-2]["created_at"]->format('Y-m-d H:i:s.v') 
            //     : null,
            // 'data' => VlideResource::collection($vlides),
            'data' => VlideForListResource::collection($vlides),
            // 'data' => $vlides->take($per_page),
        ];
    }
}
