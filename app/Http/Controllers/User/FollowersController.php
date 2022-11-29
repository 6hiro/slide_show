<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Services\UserService;
use App\Http\Resources\UserResource;


class FollowersController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UserService $userService)
    {
        // $user_id = $request->user()->id;

        // $followers = $user->followers->sortByDesc('created_at');

        // $user_id = $request->user()->id;
        $user_id = $request->route('userId');
        $per_page = 12;
        $since = $request->since;
        
        $user = User::where('id', $user_id)->first();
        
        if($since){
            $followers = $user->followers()
                ->where('follows.created_at',  '<', $since)
                ->latest('follows.created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $followers = $user->followers()
                ->latest('follows.created_at')
                ->take($per_page+1)
                ->get();
        }

        return [

            'next_page_link' => $followers->count() > $per_page
                ? $request->url()."?since=".$followers[count($followers)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => UserResource::collection($followers->take($per_page)),
        ];
    }
}
