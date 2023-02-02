<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        $img_file_name = $this->img_file_name 
            ? '/api/v1/image?f='.$this->img_file_name
            : "";

        return [
            'id' => $this->id,
            'title' => $this->title,
            'overview' => $this->overview,
            'book_type' => $this->book_type,
            'img_file_name' => $img_file_name,
            'is_public' => $this->is_public,
            // 'created_at' => $this->created_at->format('Y/m/d'),
            'updated_at' => $this->updated_at->format('Y/m/d'),
            'published_at' => $this->published_at ,

            'count_tickets' => $this->count_valid_tickets,
            'is_got' => $this->isGotBy(Auth::user()),
            'is_admitted' => $this->isAdmitted(Auth::user()),
            // 'has_page_of' => $this->hasPageOf(Auth::user()),
            'pages' => PageResource::collection($this->whenLoaded('pages')),
            'user' => new UserResource($this->whenLoaded('user')),


        ];
    }
}
