<?php

namespace App\Http\Controllers\Clip;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Clip;
use App\Http\Resources\ClipResource;
use Illuminate\Support\Facades\Auth;

class VlideController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        // $user_id = $request->user()->id;

        $vlide_id = $request->route('vlideId');

        $per_page = 10;
        $since = $request->since;
        
        if($request->since){
            $clips = Clip::with(['tags', 'user'])
                ->where('vlide_id', $vlide_id)
                // ->Where('is_public', true)
                ->where('created_at', '<', $since)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        else
        {
            $clips =Clip::with(['tags', 'user'])
                ->where('vlide_id', $vlide_id)
                // ->Where('is_public', true)
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }

        return [
            'next_page_link'=>$clips->count()>$per_page 
                ? $request->url()."?since=".$clips[count($clips)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => ClipResource::collection($clips->take($per_page)),
        ];
    }
}
