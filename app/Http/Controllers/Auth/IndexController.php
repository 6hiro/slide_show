<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
// use App\Services\ClipService;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class IndexController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $user = User::with(['vlides'])->find(Auth::id());
        
        return new UserResource($user);
    }
}
