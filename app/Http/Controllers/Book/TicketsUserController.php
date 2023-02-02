<?php

namespace App\Http\Controllers\Book;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TicketService;
use App\Http\Resources\TicketUserResource;

class TicketsUserController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request, TicketService $ticketService)
    {
        $bookId = $request->route('bookId');
        $per_page = 12;
        $since = $request->since;
    
        $ticket_users = $ticketService->getTicketUsers($bookId, $per_page, $since);

        return [
            'next_page_link' => $ticket_users->count() > $per_page
                ? $request->url()."?since=".$ticket_users[count($ticket_users)-2]["pivot"]["created_at"]->format('Y-m-d H:i:s') 
                : null,
            'data' => TicketUserResource::collection($ticket_users->take($per_page)),
        ];
    }
}
