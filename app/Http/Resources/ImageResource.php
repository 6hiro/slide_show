<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ImageResource extends JsonResource
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
        // $vlides = $this->whenloaded('vlides');

        $url = $this->name 
            ? '/api/v1/image?f='.$this->name
            : "";

        // $vlide_ids 

        return [
            'id' => $this->id,
            'url'=> $url,
            'is_public' => $this->is_public,
            // 'vlide_ids'=> $vlides ? $vlides->pluck("id") : [],
            // 'vlides'=> $vlides,
            'vlides' => VlideForListResource::collection($this->whenLoaded('vlides')),

        ];
    }
}
