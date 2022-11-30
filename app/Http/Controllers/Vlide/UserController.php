<?php

namespace App\Http\Controllers\Vlide;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Services\VlideService;
use Illuminate\Http\Request;
// use App\Models\Vlide
use App\Http\Resources\VlideResource;



class UserController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, VlideService $vlideService)  // Single Action Controller
    {
        $per_page = 12;
        $since = $request->since;
        $user_id = $request->route('userId');
        $auth_id = Auth::id();

        $vlides = $vlideService->getUserVlides(
            $auth_id, 
            $user_id, 
            $per_page, 
            $since
        );
        // $user =  User::where('id', $request->user()->id)->first();
        // $user = $request->user();
        // $audio_file_names = array_filter( 
        //     $user->vlides()->get()->pluck("audio_file_name")->toArray() 
        // );

        return [
            'next_page_link'=>$vlides->count()>$per_page 
                ? $request->url()."?since=".$vlides[count($vlides)-2]["published_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => VlideResource::collection($vlides->take($per_page)),
        ];
    }
}
