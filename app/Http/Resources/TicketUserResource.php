<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class TicketUserResource extends JsonResource
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
        $bookId = $request->route('bookId');

        $file_name = $this->file_name 
            ? '/api/v1/image?f='.$this->file_name
            : "";

        return [
            'id' => $this->id,
            'name'=> $this->name,
            'nick_name'=> $this->nick_name,
            'description' => $this->description,
            'file_name' => $file_name,
            'isFollowed' => $this->isFollowedBy(Auth::user()),
            'count_followings' => $this->count_followings,
            'count_followers' => $this->count_followers,
            'count_vlides' => $this->count_public_vlides,
            'description' => $this->description,
            'email_verified_at' => $this->email_verified_at->format('Y/m/d'),
            'is_admitted' => $this->isAdmitted($bookId)

        ];
    }
}
