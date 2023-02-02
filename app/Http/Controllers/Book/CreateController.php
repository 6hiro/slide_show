<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\CreateRequest;
use App\Services\BookService;


class CreateController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\CreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(CreateRequest $request, BookService $bookService)
    {
        $book_count = $bookService->getUserBookCount(
            $request->user()->id
        );
        if($book_count >= 1)
        {
            return response()->json([
                    'count' => $book_count,
                    'status'=>'over',
                ], 403);
        }

        $book_id = $bookService->create(
            $request->user()->id,
            $request->title(),
            $request->is_public(),
        );

        return response()->json([
                'id' => $book_id,
                'status'=>'success',
            ], 201);
            
    }
}
