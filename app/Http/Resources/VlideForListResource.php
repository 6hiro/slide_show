<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class VlideForListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {

        // return parent::toArray($request);
        // $published_at = $this->published_at != null ? $this->published_at->format('Y/m/d') : null;
        // (gettype($this->published_at) === "string") ? $this->published_at->format('Y/m/d') : null;

        $bookId = $request->route('bookId');
        // return parent::toArray($request);
        $isPageOf = $bookId ? $this->isPageOf($bookId) : false;

        $audio_file_name = $this->audio_file_name 
        ? '/api/v1/audio?f='.$this->audio_file_name
        : "";

        $header_file_name = $this->header_file_name 
            ? '/api/v1/image?f='.$this->header_file_name
            : "";

        return [
            'id' => $this->id,
            'title' => $this->title,
            // 'content' => $this->content,
            'duration' => $this->duration,
            'header_file_name' => $header_file_name,
            'audio_file_name' => $audio_file_name,
            // 'header_file_name' => $this->header_file_name,
            // 'audio_file_name' => $this->audio_file_name,
            'is_public' => $this->is_public,
            // 'created_at' => $this->created_at->format('Y/m/d'),
            'updated_at' => $this->updated_at->format('Y/m/d'),
            'published_at' => $this->published_at ,
            'isPageOf' => $isPageOf,

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'count_saves' => $this->count_saves,
                'is_saved' => $this->isSavedBy(Auth::user()),
                'user' => new UserResource($this->whenLoaded('user')),

                // 'tags' => TagForVlideResource::collection($this->whenLoaded('tags')),
                'clips' => $this->whenLoaded('clips'),
                'count_clips' => $this->count_clips,    

            // ]
        ];
    }
}
