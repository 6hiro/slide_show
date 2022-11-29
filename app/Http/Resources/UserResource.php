<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
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
        $vlides = $this->whenloaded('vlides');
        // $posts = $this->whenloaded('posts');

        return [
            'id' => $this->id,
            'name'=> $this->name,
            'nick_name'=> $this->nick_name,
            'description' => $this->description,
            'isFollowed' => $this->isFollowedBy(Auth::user()),
            'count_followings' => $this->count_followings,
            'count_followers' => $this->count_followers,
            'count_vlides' => $this->count_vlides,
            'description' => $this->description,
            // 'vlides'=> VlideResource::collection($vlides),
            'email_verified_at' => $this->updated_at->format('Y/m/d'),

            // 'posts'=> PostResource::collection($posts),
        ];
    }
}
