<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Resources\UserResource;


class LatestSearchController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UserService $userService)
    {
        // $tag_name = $request->route('tag_name');
        $word = $request->word;
        $per_page = 12;
        $since = $request->since;
        $users = $userService->getSearch($word, $per_page, $since);

        return [
            'count'=>$users->count(),
            'next_page_link'=>$users->count()>$per_page 
                ? $request->url()."?word=".$word."&since=".$users[count($users)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => UserResource::collection($users->take($per_page)),
            // 'w' => $word,
        ];
    }
}
