<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BookService;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class DeleteController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, BookService $bookService)
    {
        $bookId = $request->route('bookId');

        if( !$bookService->checkOwnBook($request->user()->id, $bookId) ){
            throw new AccessDeniedException();
        }
        $bookService->deleteBook($bookId);
        // return $book->delete()
        
        return response()->json($bookId);
    }
}
