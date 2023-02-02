<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PageResource extends JsonResource //vlide
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        $bookId = $request->route('bookId');
        // return parent::toArray($request);
        $isPageOf = $bookId ? $this->isPageOf($bookId) : false;
        $book = $this->books->where('id', $bookId)->first();
        $order = $book->pivot ? $book->pivot->order : null;

        // $published_at = $this->published_at != null ? $this->published_at->format('Y/m/d') : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            // 'duration' => $this->duration,
            'is_public' => $this->is_public,
            'updated_at' => $this->updated_at->format('Y/m/d'),
            // 'published_at' => $this->published_at ,
            'isPageOf' => $isPageOf,
            // 'book_id' => $bookId,
            'order' => $order,
            // 'book' => $book,
            // 'books' => BookResource::collection($this->whenLoaded('books')),
            // 'books' => $this->books,

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                // 'count_saves' => $this->count_saves,
                // 'is_saved' => $this->isSavedBy(Auth::user()),
                'user' => new UserResource($this->whenLoaded('user')),
                // 'clips' => $this->whenLoaded('clips'),
                // 'count_clips' => $this->count_clips,    
            // ]
        ];
    }
}
