<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\UpdateRequest;

use App\Services\VlideService;
use App\Services\BookService;
use App\Http\Resources\PageResource;


use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class ChangePageOrderController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, BookService $bookService)
    {
        // $book_id = $request->route('bookId');

        $result = $bookService->changePageOrder(
            $request->user()->id,
            $request->bookId,
            $request->pages
        );

        return response()->json($result);
        // return $result;
    }
}
