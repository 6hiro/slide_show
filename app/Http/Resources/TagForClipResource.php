<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TagForClipResource extends JsonResource
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
        $clips = $this->whenloaded('clips');

        return [
            'id' => $this->id,
            'name'=> $this->name,
            'clips'=> ClipResource::collection($clips),
        ];
    }
}
