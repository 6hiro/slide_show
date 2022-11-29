<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Services\UserService;
use App\Http\Resources\UserResource;


class LikedByController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UserService $userService)
    {
        $vlideId = $request->route('vlideId');
        $per_page = 5;
        $since = $request->since;
    
        $clip = Clip::where('id', $vlideId)->first();

        if($since){
            $likedBy = $clip->likes()
                ->where('likes.created_at',  '<', $since)
                ->latest('likes.created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $likedBy = $clip->likes()
                ->latest('likes.created_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link' => $likedBy->count() > $per_page
                ? $request->url()."?since=".$likedBy[count($likedBy)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => UserResource::collection($likedBy->take($per_page)),
        ];
    }
}
