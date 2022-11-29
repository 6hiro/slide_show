<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Clip;
use App\Http\Resources\ClipResource;
use Illuminate\Support\Facades\Auth;

class FollowingsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user_id = $request->user()->id;
        $per_page = 5;
        $since = $request->since;

        if($request->since){
            $clips = Clips::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->where('clip_type', 'clip')
                ->where('created_at', '<', $since)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        else
        {
            $clips =Clip::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->where('clip_type', 'clip')
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]->format('Y-m-d H:i:s.v') : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
