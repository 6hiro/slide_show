<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Clip;

use App\Http\Resources\UserResource;
use App\Services\ClipService;


class LikeUsersController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, ClipService $clipService)
    {
        $clipId = $request->route('clipId');
        $per_page = 12;
        $since = $request->since;
    
        $like_users = $clipService->getLikeUsers($clipId, $per_page, $since);

        return [
            // $per_page=1 , $like_users->count()=2  count($like_users)-2 
            'next_page_link' => $like_users->count() > $per_page
                ? $request->url()."?since=".$like_users[count($like_users)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s') 
                : null,
            'data' => UserResource::collection($like_users->take($per_page)),
        ];
    }
}
