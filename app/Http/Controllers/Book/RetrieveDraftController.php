<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BookService;
use App\Http\Resources\BookResource;

class RetrieveDraftController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, BookService $bookService)
    {
        //
        $bookId = $request->route('bookId');
        $book =  $bookService->retriveBook($bookId);
        
        if(!$book) return response()->json();

        // return $book;
        if($book->user_id === $request->user()->id) {
            return response()
                ->json(
                    // $book 
                    new BookResource( $book )
                );
        }
        else {
            return response()->json();
        }
    }
}
