<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use App\Services\VlideService;
use Illuminate\Http\Request;
// use App\Models\Vlide
use App\Http\Resources\VlideResource;

use DateTime;
use DateTimeZone;

class LatestTagController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)  // Single Action Controller
    {
        $tag_name = $request->tag_name;

        $per_page = 12;
        $since = $request->since;
        $vlides = $vlideService->getTag($tag_name, $per_page, $since);

        return [
            'next_page_link'=>$vlides->count()>$per_page 
                ? $request->url()."?since=".$vlides[count($vlides)-2]["published_at"]
                // ->format('Y-m-d H:i:s.v') 
                : null,
            'data' => VlideResource::collection($vlides->take($per_page)),
            // 'data' => $vlides->take($per_page),
        ];
    }
}
