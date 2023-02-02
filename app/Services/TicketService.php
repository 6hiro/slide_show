<?php

namespace App\Services;

use App\Models\Vlide;
// use App\Models\Tag;
use App\Models\Book;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use DateTime;
use DateTimeZone;

class TicketService
{
    public function getTicketCount(string $bookId)
    {
        $book = Book::where('id', $bookId)->first();
        return $book->count_tickets;
        // return [
        //     'id' => $book->id,
        //     'count_tickets' => $book->count_tickets+1,
        // ];
    }

    public function getValidTicketCount(string $bookId)
    {
        $book = Book::where('id', $bookId)->first();
        return $book->count_valid_tickets;
    }
    public function getValidTickets(string $bookId)
    {
        $book = Book::where('id', $bookId)->first();
        return $book->validTickets()->get();
    }

    public function getUnget(User $user, string $bookId)
    {
        $book = Book::where('id', $bookId)->first();

        if($book->isGotBy($user))
        {
            // $book->tickets()->where('user_id', $user->id)->pivot->is_admitted;
            $book->tickets()->detach($user->id);
            
            return [
                'id' => $book->id,
                // 'a' => $book->tickets()->where('user_id', $user->id)->pivot->is_admitted,
                'count_tickets' => $book->count_valid_tickets-1,
                'result' => 'unget'
            ];
        }
        else
        {
            $book->tickets()->detach($user->id);
            // $book->tickets()->updateExistingPivot($book_id, ['priority' => 3]);

            $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            $created_at = $dateTime->format('Y-m-d H:i:s.v');

            // default: 誰でもチケットをゲットできる, protected: 承認制

            $is_admitted = $book->book_type==='default' ? true : false;
            $book->tickets()->attach($user->id, ['created_at' => $created_at, 'is_admitted' => $is_admitted]);

            return [
                'id' => $book->id,
                'count_tickets' =>  $book->book_type==='default' ? $book->count_valid_tickets+1 : $book->count_valid_tickets,
                'result' => $book->book_type==='default' ? 'get' : 'unapproved'
            ];
    
        }
    }

    public function approve(string $book_id, string $user_id)
    {
        $book = Book::where('id', $book_id)->first();
        if(!$book) return [];

        $book->tickets()->updateExistingPivot($user_id, ['is_admitted' => true]);

        return [
            'id' => $book->id,
            'count_tickets' => $book->count_valid_tickets+1,
            'result' => 'approved'
        ];
    }
    public function unapprove(string $book_id, string $user_id)
    {
        $book = Book::where('id', $book_id)->first();
        if(!$book) return [];

        $book->tickets()->updateExistingPivot($user_id, ['is_admitted' => false]);
        
        return [
            'id' => $book->id,
            'count_tickets' => $book->count_valid_tickets-1,
            'result' =>  'unapproved'
        ];
    }
    

    public function getTicketUsers(string $book_id, int $per_page, ?string $since)
    {
        $book = Book::where('id', $book_id)->first();
        
        if($since){
            $users = $book->tickets()
                ->where('tickets.created_at',  '<', $since)
                ->latest('tickets.created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $users = $book->tickets()
                ->take($per_page+1)
                ->latest('tickets.created_at')
                ->get();
        }

        return $users;
    }

    public function getUserTickets(string $user_id, int $per_page, ?string $since)
    {
        $user = User::where('id', $user_id)->first();
        
        if($since){
            $tickets = $user->tickets()
                ->with(['user'])
                ->where('tickets.created_at',  '<', $since)
                ->latest('tickets.created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $tickets = $user->tickets()
                ->with(['user'])
                ->take($per_page+1)
                ->latest('tickets.created_at')
                ->get();
        }

        return $tickets;
    }
}