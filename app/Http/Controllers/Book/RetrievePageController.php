<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\BookService;
use App\Http\Resources\VlideResource;

class RetrievePageController extends Controller
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
        $vlideId = $request->route('vlideId');
        $bookId = $request->route('bookId');
        $vlide =  $bookService->retrivePage($bookId, $vlideId, $request->user());
        // return $vlide;
        if($vlide) {
            return response()
                ->json(
                    new VlideResource( $vlide )
                );
        }
        else {
            // if()
            return response()->json();
        }
    }
}
