<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ClipService;
use App\Http\Resources\ClipResource;

use DateTime;
use DateTimeZone;


class RankSearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        //
        $word = $request->word;

        $per_page = 5;

        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        $since = $dateTime->modify('-1week')->format('Y-m-d H:i:s.v');
        
        $clips = $clipService->getRankSearch($word, $per_page, $since);

        return [
            'data' => ClipResource::collection($clips),
        ];
    }
}
