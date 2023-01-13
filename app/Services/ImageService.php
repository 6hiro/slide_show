<?php

namespace App\Services;

use App\Models\Vlide;
use App\Models\Image;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use DateTime;
use DateTimeZone;

class ImageService
{
    public function getUserImages(string $user_id, int $per_page, ?string $since)
    {
        if($since){
            $images = Image::with(['user', 'vlides'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->whereHas('vlides', function($q){  // 少なくとも 1 つ
                    $q->where('is_public', true);
                })
                ->Where('is_public', true)
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $images = Image::with(['user', 'vlides'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->whereHas('vlides', function($q){
                    $q->where('is_public', true);
                })
                ->Where('is_public', true)
                ->orderBy('created_at', 'DESC')
                ->take($per_page+1)
                ->get();
        }

        return $images;
    }
}