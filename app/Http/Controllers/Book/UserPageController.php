<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use Illuminate\Http\Request;
// use App\Models\Vlide
// use App\Services\VlideService;
use App\Services\BookService;
use App\Http\Resources\PageResource;
use App\Http\Resources\VlideForListResource;



class UserPageController extends Controller
{
    /**
     * Handle the incoming request.
     * sail artisan make:controller Vlide/IndexController --invokable
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, BookService $bookService)  // Single Action Controller
    {
        $per_page = 12;
        $since = $request->since;
        $user_id = $request->route('userId');
        $auth_id = Auth::id();

        // $vlides = $vlideService->getUserVlides(
        $vlides = $bookService->getUserVlides(
            $auth_id, 
            $user_id, 
            $per_page, 
            $since
        );

        return [
            'next_page_link'=>$vlides->count()>$per_page 
                ? $request->url()."?since=".$vlides[count($vlides)-2]["created_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => VlideForListResource::collection($vlides->take($per_page)),
        ];
    }
}
