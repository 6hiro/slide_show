<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Book;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Services\BookService;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;

class DeleteImageController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, BookService $bookService)
    {
        $user = $request->user();

        if( !$bookService->checkOwnBook($request->user()->id, $bookId) ){
            throw new AccessDeniedException();
        }
        
        $bookService->deleteImg($bookId);
        
        return response()->json([
        ], 204);
    }
}
