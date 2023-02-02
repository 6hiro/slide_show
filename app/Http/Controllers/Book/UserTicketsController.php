<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TicketService;
use App\Http\Resources\BookResource;

class UserTicketsController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, TicketService $ticketService)
    {
        $user_id = $request->user()->id;

        $per_page = 12;
        $since = $request->since;
    
        $tickets = $ticketService->getUserTickets($user_id, $per_page, $since);

        return [
            'next_page_link' => $tickets->count() > $per_page
                ? $request->url()."?since=".$tickets[count($tickets)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s') 
                : null,
            // 'data' => $tickets->take($per_page),
            'data' => BookResource::collection($tickets->take($per_page)),
        ];
    }
}
