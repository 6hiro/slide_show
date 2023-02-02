<?php

namespace App\Services;

use App\Models\Vlide;
// use App\Models\Tag;
use App\Models\Book;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProjvider;
use DateTime;
use DateTimeZone;

class BookService
{
    public function getUserBookCount(string $userId)
    {
        return Book::whereHas('user', function($q) use ($userId){
                $q->where('user_id', $userId);
            })->count();
    }
    public function getUserBooks(?string $auth_id, string $user_id, int $per_page, ?string $since)
    {
        if($auth_id === $user_id){
            if($since){
                $books = Book::with(['pages', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $books = Book::with(['pages', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->orderBy('created_at', 'DESC')
                    ->take($per_page+1)
                    ->get();
            }
        }else{
            if($since){
                $books = Book::with(['pages', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('is_public', true)
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $books = Book::with(['pages', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('is_public', true)
                    ->orderBy('created_at', 'DESC')
                    ->take($per_page+1)
                    ->get();
            }
        }

        return $books;
    }
    // public function getPages(?string $auth_id, string $user_id, int $per_page, ?string $since)
    public function getUserVlides(?string $auth_id, string $user_id, int $per_page, ?string $since)
    {
        // return User::with(['vlides'])->where('id', $user_id)->first()->vlides;
        if($auth_id === $user_id){
            if($since){
                $vlides = Vlide::with(['books', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $vlides = Vlide::with(['books', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->orderBy('created_at', 'DESC')
                    ->take($per_page+1)
                    ->get();
            }
        }else{
            if($since){
                $vlides = Vlide::with(['books', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('is_public', true)
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $vlides = Vlide::with(['books', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('is_public', true)
                    ->orderBy('created_at', 'DESC')
                    ->take($per_page+1)
                    ->get();
            }
        }

        return $vlides;
    }

    public function checkOwnBook(string $userId, string $book_id)
    {
        $book = Book::where('id', $book_id)->first();

        if(!$book){
            return false;
        }
        return $book->user_id === $userId;
    }
    public function retriveBook(string $bookId)
    {
        return Book::with([
                'user', 
                'pages'
            ])
            ->find($bookId);
    }
    public function retrivePage(string $bookId, string $vlideId, $user)
    {
        $book = Book::with(['pages'])->where('id', $bookId)->first();

        // ブックが公開されていない場合はページを返さない
        if(!$book->is_public ) return null;

        // ユーザーがチケットを持っていないかつ、ユーザーのブックでない場合はページを返さない
        if(!$book->isGotBy($user) && ($book->user_id !== $user->id)) return null;
        
        // チケットが承認されていないかつ、ユーザーのブックでない場合はページを返さない
        if(!$book->isAdmitted($user) && ($book->user_id !== $user->id)) return null;

        $vlide =  Vlide::with([
                'tags', 
                'user', 
                'images', 
            ])
            ->find($vlideId);
            
        if(!$vlide) return null;
        if(!$book->hasPageOf($vlide)) return null;
        
        return $vlide;
    }

    public function create(string $userId, string $title, bool $is_public)
        {    
            return DB::transaction(function () use($userId, $title, $is_public) {
                $book = new Book();
                $book->user_id = $userId;
                $book->title = $title;
                // default: 誰でもチケットをゲットできる, protected: 承認制
                $book->book_type = "default";  
                $book->is_public = $is_public;
                $book->save();

                return $book->id;
            });

        }
    public function updateBook(string $book_id, string $title, string $overview, bool $is_public, string $book_type)
    {
        return DB::transaction(function () use($book_id, $title, $overview, $is_public, $book_type) {

            $book = Book::where('id', $book_id)->firstOrFail();

            $book->title = $title;
            $book->overview = $overview;
            $book->is_public = $is_public;
            $book->book_type = $book_type;

            if( !$book->published_at && $is_public ){ // 初公開日の保存
                // $dateTime = new DateTime();
                $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
                $book->published_at = $dateTime->format('Y-m-d H:i:s.v');
            }            

            $book->save();
            return $book->id;
        });
    }
    public function setUnsetPage(string $book_id, string $vlide_id)
    {
        $book = Book::where('id', $book_id)->first();
        $vlide = Vlide::where('id', $vlide_id)->first();

        // if(!$book || !$vlide) 
        if($vlide->isPageOf($book->id))
        {
            $book->pages()->detach($vlide_id);

            return [
                'id' => $book->id,
                'vlide_id' => $vlide_id,
                'result' => 'unset'
            ];
        }
        else
        {
            $pages = $book->pages; // vlides
            $order = 0;

            if($pages->count()!==0){
                $order_list = array();

                foreach($pages as $page){
                    array_push($order_list, $page->pivot->order);
                }
                $max_order = max($order_list);

                $order = $max_order+1;
            }
            $book->pages()->detach($vlide_id);
            $book->pages()->attach($vlide_id, ['order' => $order]);
            return [
                'id' => $book->id,
                'vlide_id' => $vlide_id,
                'result' => 'set'
            ];
        }
        // return $vlide;
    }

    public function changePageOrder(string $user_id, string $book_id, array $pages)
    {
        $book = Book::where('id', $book_id)->first();

        $old_pages = $book->pages; // vlides
        
        $new_pages = $pages;

        foreach($old_pages as $old_page){
            // 「$old_pagesのid」とidが同じ$new_pagesの、配列のキー値を返す
            // array_search( 検索文字列, array_column( 検索対象の配列, 検索する値))
            $new_page_key = array_search($old_page["id"], array_column( $new_pages, 'id'));
            $new_page = $new_pages[$new_page_key];

            if($new_page["order"] !== $old_page->pivot->order){
                $book->pages()->updateExistingPivot($old_page->pivot->vlide_id, ['order' => $new_page["order"]]);
            }
        }
        return [
            'id' => $book->id,
            'result' => 'order-changed'
        ];
    }

    public function deleteBook(string $bookId)
    {
        DB::transaction(function () use($bookId) {
            $book = Book::where('id', $bookId)->firstOrFail();

            if($book->img_file_name){
                $filePath = 'public/images/'.$user->img_file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }
            
            $book->delete();
        });
    }

    public function uploadImg(string $bookId, $image)
    {
        $file_name = Str::random(32).".".$image->getClientOriginalExtension();

        $target =  DB::transaction(function () use($bookId, $image, $file_name) {
            $book = Book::where('id', $bookId)->firstOrFail();

            if($book->img_file_name){
                $filePath = 'public/images/'.$book->img_file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }

            $path = Storage::disk('s3')->putFileAs('public/images', $image, $file_name);

            $book->img_file_name = $file_name;
            $book->save();

            return $img_file_name;
        });

        return $target;
    }
    public function deleteImg(string $bookId)
    {
        $book = Book::where('id', $bookId)->firstOrFail();

        $target = DB::transaction(function () use($book) {

            if($book->img_file_name){
                $filePath = 'public/images/'.$book->img_file_name;
                
                if(Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                }
            }

            
            $book->img_file_name = null;
            $book->save();

            return $book->id;
        });
        return $target;
    }


}