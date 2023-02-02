<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
// use App\Models\Vlide
use App\Http\Resources\VlideForListResource;

use DateTime;
use DateTimeZone;

class RankSearchController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)  // Single Action Controller
    {
        $word = $request->word;

        $per_page = 12;

        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        
        $since = $dateTime->modify('-1 month')->format('Y-m-d H:i:s.v');
        
        $vlides = $vlideService->getRankSearch($word, $per_page, $since);

        return [
            // 'data' => VlideResource::collection($vlides),
            'data' => VlideForListResource::collection($vlides),
        ];
    }
}
