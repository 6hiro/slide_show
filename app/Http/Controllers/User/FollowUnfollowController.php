<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\UserService;
use App\Http\Resources\UserResource;


class FollowUnfollowController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, UserService $userService)
    {
        $userId = $request->route('userId');
        
        if($request->user()->id === $userId) {
            return abort('404', 'Cannot follow yourself.');
        }

        $result = $userService->followUnfollow(
            $request->user(),
            $userId
        );

        return $result;
    }
}
