<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Http\Requests\User\UploadImageRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Services\BookService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateImageController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(UploadImageRequest $request, BookService $bookService)
    {
        $bookId = $request->route('bookId');

        if( !$bookService->checkOwnBook($request->user()->id, $bookId) ){
            throw new AccessDeniedException();
        }

        $image = $request->file('image');

        $target = $bookService->uploadImg($bookId, $image);

        return $target
            ? response()->json([
                    'file_path' => $target,
                    'vlide_id'=>$bookId,
                ])
            : response()->json([], 500);
    }
}
