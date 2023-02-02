<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\UpdateRequest;

use App\Services\VlideService;
use App\Services\BookService;

use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class UpdateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UpdateRequest $request, BookService $bookService)
    {
        $bookId = $request->route('bookId');
        if( !$bookService->checkOwnBook($request->user()->id, $bookId) ){
            throw new AccessDeniedException();
        }

        $book_id = $bookService->updateBook(
            $bookId,
            $request->title(),
            $request->overview(),
            $request->is_public(),
            $request->book_type(),
        );

        return response()->json([
            'id' => $bookId,
            'status'=>'success',
            // "a" =>$request->overview()
        ], 201);

    }
}
