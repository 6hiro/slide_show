<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Services\TicketService;
use App\Services\BookService;


class GetUngetTicketController extends Controller
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

        // 自分のブックはゲットできない
        if( $bookService->checkOwnBook($request->user()->id, $bookId) ){
            return response()->json([], 200);
        }


        $ticket_count = $ticketService->getValidTicketCount($bookId);
        // return $ticketService->getValidTickets($bookId);
        $max = 100;
        if($ticket_count >= $max)
        {
            return response()->json([
                    'count' => $ticket_count,
                    'status'=>'over',
                ], 403);
        }


        $result = $ticketService->getUnget(
            $request->user(),
            $bookId
        );

        return response()->json($result, 201);
            
    }
}
