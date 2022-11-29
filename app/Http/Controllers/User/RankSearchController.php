<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Resources\UserResource;

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
    public function __invoke(Request $request, UserService $userService)
    {
        //
        $word = $request->word;

        $per_page = 12;

        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        $since = $dateTime->modify('-1week')->format('Y-m-d H:i:s.v');
        
        $users = $userService->getRankSearch($word, $per_page, $since);

        return [
            'data' => UserResource::collection($users),
        ];
    }
}
