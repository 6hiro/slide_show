<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Book\UpdateRequest;

use App\Services\VlideService;
use App\Services\BookService;
use App\Http\Resources\PageResource;


use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class SetUnsetPageController extends Controller
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
        $vlideId = $request->route('vlideId');

        if( !$bookService->checkOwnBook($request->user()->id, $bookId) ){
            throw new AccessDeniedException();
        }

        $result = $bookService->setUnsetPage(
            $bookId,
            $vlideId
        );
        return $result;

        // return response()->json([
        //     'page' => new PageResource($page),
        //     'status'=>'success',
        // ], 201);

    }
}
