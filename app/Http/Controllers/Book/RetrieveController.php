<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BookService;
use App\Http\Resources\BookResource;

class RetrieveController extends Controller
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

        if($book->is_public) {
            return response()
                ->json(
                    new BookResource( $book )
                );
        }
        else {
            return response()->json();
        }
    }
}
