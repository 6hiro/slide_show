<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Clip;

use App\Http\Resources\UserResource;
use App\Services\ClipService;


class ShareUsersController extends Controller
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
    
        $share_users = $clipService->getShareUsers($clipId, $per_page, $since);

        return [
            'a' =>$share_users->count(),
            'next_page_link' => $share_users->count() > $per_page
                ? $request->url()."?since=".$share_users[count($share_users)-2]["created_at"]->format('Y-m-d H:i:s') 
                // ? $request->url()."?since=".$share_users[count($share_users)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s') 
                : null,
            'data' => UserResource::collection($share_users->pluck('user')->take($per_page)),            
        ];
    }
}
