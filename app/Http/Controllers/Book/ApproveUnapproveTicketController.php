<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\TicketService;
use App\Services\BookService;


class ApproveUnapproveTicketController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\CreateRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, TicketService $ticketService, BookService $bookService)
    {
        $bookId = $request->route('bookId');


        $is_approved = $request->is_approved;
        if($is_approved) {
            $result = $ticketService->approve(
                $bookId,
                $request->user_id,
            );
        }else{
            $result = $ticketService->unapprove(
                $bookId,
                $request->user_id,
            );
        }

        return response()->json($result, 201);            
    }
}
