<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use DateTime;
use App\Http\Resources\ClipResource;

use DateTimeZone;

class RankTagController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        $per_page = 5;
        $tag_name = $request->tag_name;

        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        $since = $dateTime->modify('-1week')->format('Y-m-d H:i:s.v');
        $clips = $clipService->getRankTag($tag_name, $per_page, $since);

        return [
            'data' => ClipResource::collection($clips),

        ];
    }
}
