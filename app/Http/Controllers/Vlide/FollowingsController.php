<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\VlideForListResource;
use App\Models\Vlide;

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
        $per_page = 12;
        $since = $request->since;
        
        if($request->since){
            $vlides = Vlide::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->where('published_at', '<', $since)
                ->orderByDesc('published_at')
                ->take($per_page+1)
                ->get();
        }
        else
        {
            $vlides =Vlide::with(['tags', 'user'])
                ->whereIn('user_id', Auth::user()->followings()->pluck('followee_id'))
                ->Where('is_public', true)
                ->orderByDesc('published_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link'=>$vlides->count()>$per_page 
                ? $request->url()."?since=".$vlides[count($vlides)-2]["published_at"]
                    // ->format('Y-m-d H:i:s.v') 
                : null,
            'data' => VlideForListResource::collection($vlides->take($per_page)),
        ];
    }
}
