<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

use App\Services\BookService;
use Illuminate\Http\Request;
use App\Http\Resources\BookForListResource;



class UserController extends Controller
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

        $books = $bookService->getUserBooks(
            $auth_id, 
            $user_id, 
            $per_page, 
            $since
        );

        return [
            'next_page_link'=>$books->count()>$per_page 
                ? $request->url()."?since=".$books[count($books)-2]["published_at"]->format('Y-m-d H:i:s.v') 
                : null,
            'data' => BookForListResource::collection($books->take($per_page)),
            // 'data' => $books->take($per_page),

        ];
    }
}
