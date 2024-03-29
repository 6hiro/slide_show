<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ParentClipResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public static $wrap = '';

    public function toArray($request)
    {
        // return parent::toArray($request);
        return [
            'id' => $this->id,
            'clip_type' => $this->clip_type,
            'content' => $this->content,
            'quote' => $this->quote,

            'created_at' => $this->created_at->format('Y/m/d H:i'),

            // '_embedded' => [
                // whenLoadedは ::with()など でリレーションが既にロードされている場合にのみ、
                // リソースレスポンスへリレーションを含める。
                'user' => new UserResource($this->whenLoaded('user')),
                // 'user' => $this->whenLoaded('user'),
                'count_likes' => $this->count_likes,
                'is_liked' => $this->isLikedBy(Auth::user()),
                'tags' => TagForClipResource::collection($this->whenLoaded('tags')),
                // 'replies'=> ClipResource::collection(
                //     // https://github.com/laravel/framework/issues/27950
                //     $this->whenLoaded('replies', function () {
                //         return $this->replies->sortBy('created_at');
                //     })
                // ),
                'count_replies' => $this->count_replies,   
                'count_reclips' => $this->count_reclips,

                'vlide_id' => $this->vlide_id,
                // 'parent' => $this->parent()->with('user')->select('id', 'user')->get(),
                // 'parent' => $this->parent_parent(),
                'parent' => new ParentClipResource($this->parent),
            // ]

        ];
    }
}
