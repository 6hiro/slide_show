<?php

namespace App\Services;

use App\Models\Vlide;
use App\Models\Tag;
use App\Models\Image;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use DateTime;
use DateTimeZone;

class VlideService
{
    public function getUservlideCount(string $userId)
    {
        return Vlide::whereHas('user', function($q) use ($userId){
                $q->where('user_id', $userId);
            })->count();
    }
    public function getVlides(int $per_page, ?string $since)
    {
        if($since){
            $vlides = Vlide::with(['tags', 'user'])
                // ->where(function($q) use ($user_id) {
                //     $q->Where('is_public', true)
                //     ->orWhere('user_id', $user_id);
                // })
                ->Where('is_public', true)
                ->where('published_at', '<', $since)
                ->latest('published_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $vlides = Vlide::with(['tags', 'user'])
                ->Where('is_public', true)
                // ->where(function($q) use ($user_id) {
                //     $q->Where('is_public', true)
                //     ->orWhere('user_id', $user_id);
                // })
                ->orderBy('published_at', 'DESC')
                ->take($per_page+1)
                ->get();
        }

        return $vlides;
    }
    public function getRank(int $per_page, ?string $since)
    {

        $vlides = Vlide::with(['tags', 'user'])
            ->Where('is_public', true)
            ->where('published_at', '>', $since)
            ->withCount('clips')
            ->orderBy('clips_count', 'desc')
            // ->latest('published_at')
            ->paginate($per_page);

        return $vlides;
    }
    // is_public = false も fetch
    public function getUserVlides(?string $auth_id, string $user_id, int $per_page, ?string $since)
    {
        if($auth_id === $user_id){
            if($since){
                $vlides = Vlide::with(['tags', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $vlides = Vlide::with(['tags', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->orderBy('created_at', 'DESC')
                    ->take($per_page+1)
                    ->get();
            }
        }else{
            if($since){
                $vlides = Vlide::with(['tags', 'user'])
                    ->whereHas('user', function($q) use ($user_id){
                        $q->where('user_id', $user_id);
                    })
                    ->where('is_public', true)
                    ->where('created_at', '<', $since)
                    ->latest('created_at')
                    ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                    ->get();
            }else{
                $vlides = Vlide::with(['tags', 'user'])
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
    public function getSaves(string $user_id, int $per_page, ?string $since)
    {
        $user = User::where('id', $user_id)->first();
        
        if($since){
            $vlides = $user->saves()
                ->Where('is_public', true)
                ->where('saves.created_at',  '<', $since)
                ->with(['tags', 'user'])
                ->take($per_page+1)
                ->get();
        }else{
            $vlides = $user->saves()->with(['tags', 'user'])
                ->Where('is_public', true)
                ->take($per_page+1)
                ->get();
        }

        return $vlides;
    }
    
    public function getTag(string $tag_name, int $per_page, ?string $since)
    {
        if($since){
            $vlides = Vlide::with(['tags', 'user'])
                ->Where('is_public', true)
                ->whereHas('tags', function($query) use ($tag_name)  {
                    // $query->where('name', $tag_name);
                    $query->where('alias', strtolower($tag_name));
                })
                ->where('published_at', '<', $since)
                ->latest('published_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $vlides = Vlide::with(['tags', 'user'])
                ->whereHas('tags', function($query) use ($tag_name)  {
                    // $query->where('name', $tag_name);
                    $query->where('alias', strtolower($tag_name));
                })
                ->latest('published_at')
                ->take($per_page+1)
                ->get();
        }

        return $vlides;
    }
    public function getRankTag(string $tag_name, int $per_page, ?string $since)
    {
        $vlides = Vlide::with(['tags', 'user'])
            ->Where('is_public', true)
            ->where('published_at', '>', $since)
            ->whereHas('tags', function($query) use ($tag_name)  {
                // $query->where('name', $tag_name);
                $query->where('alias', strtolower($tag_name));
            })
            ->withCount('clips')
            ->orderBy('clips_count', 'desc')
            // ->orderBy('count_clips_one_week', 'desc')
            // ->latest('published_at')
            ->paginate($per_page);
        return $vlides;
    }

    public function getSearch(string $word, int $per_page, ?string $since)
    {
        if($since){
            $vlides = Vlide::where('title', 'like', "%{$word}%")
                ->Where('is_public', true)
                ->with(['tags', 'user'])
                ->where('published_at', '<', $since)
                ->latest('published_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $vlides = Vlide::where('title', 'like', "%{$word}%")
                ->Where('is_public', true)
                ->with(['tags', 'user'])
                ->latest('published_at')
                ->take($per_page+1)
                ->get();
        }

        return $vlides;
    }
    public function getRankSearch(string $word, int $per_page, ?string $since)
    {
        $vlides = Vlide::where('title', 'like', "%{$word}%")
            ->Where('is_public', true)
            ->with(['tags', 'user'])
            ->where('published_at', '>', $since)
            ->withCount('clips')
            ->orderBy('clips_count', 'desc')
            // ->latest('published_at')
            ->paginate($per_page);
        return $vlides;
    }
    
    public function retriveVlide( string $vlideId)
    {
        return Vlide::with([
                'tags', 
                'user', 
                'images', 
                // 'clips'
            ])
            // ->where('id', $vlideId)
            // ->where(function($q) use ($user_id) {
            //         $q->Where('is_public', true)
            //         ->orWhere('user_id', $user_id);
            // })
            // ->Where('is_public', true)
            // ->get();
            ->find($vlideId);
    }

    public function checkCanGetAudio(?User $user, string $audio_file_name)
    {
        $vlide = Vlide::where('audio_file_name', $audio_file_name)->first();

        if(!$vlide){
            return false;
        }
        if($vlide->is_public) {
        // if($vlide->is_public && !$vlide->vlide_type) {
            return true;
        }
        if($user){
            return $vlide->user_id === $user->id;
        }
        return false;

    }

    public function checkOwnVlide(string $userId, string $vlideId)
    {
        $vlide = Vlide::where('id', $vlideId)->first();

        if(!$vlide){
            return false;
        }
        return $vlide->user_id === $userId;
    }

    public function create(string $userId, string $title, array $tag_list, bool $is_public)
    {    
        return DB::transaction(function () use($userId, $title, $tag_list, $is_public) {
            $vlide = new Vlide();
            $vlide->user_id = $userId;
            $vlide->title = $title;
            $vlide->is_public = $is_public;
            $vlide->duration = 0;
            $vlide->save();

            // タグの保存
            // foreach ($tag_list as $tag_name) {
            //     $tag = Tag::firstOrCreate(['name' => $tag_name]);
            //     // $tag = Tag::firstOrCreate(['name' => $tag_name], ['alias' => strtolower($tag_name)]);
            //     // $vlide->tags()->attach($tag);

            //     $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            //     $created_at = $dateTime->format('Y-m-d H:i:s.v');
            //     $vlide->tags()->attach($tag->id, ['created_at' => $created_at]);
            // }
            $tag_id_list = [];
            foreach ($tag_list as $tag_name) {
                // $tag = Tag::firstOrCreate(['name' => $tag_name]);
                // $tag = Tag::firstOrCreate(['name' => $tag_name], ['alias' => strtolower($tag_name)]);
                $tag = Tag::where('name', $tag_name)->first();

                if (empty($tag)) {
                    $tag = Tag::create([
                        'name' => $tag_name,
                        'alias' => strtolower($tag_name),
                    ]);
                }else if($tag && $tag->name) {
                    // $tag = Tag::create([
                    //     'name' => $tag_name,
                    //     'alias' => strtolower($tag_name),
                    // ]);
                }
                $tag_id_list[] = $tag->id;
            }
            $vlide->tags()->sync($tag_id_list);

            // foreach ($images as $image) {
            //     Storage::putFile('public/images', $image);
            //     $imageModel = new Image();
            //     $imageModel->name = $image->name;
            //     $imageModel->save();
            //     $vlide->images()->attach($imageModel->id);
            // }
            return $vlide->id;
        });

    }
    public function uploadAudioVlide(string $vlideId, $audio)
    {
            $vlide = Vlide::where('id', $vlideId)->firstOrFail();

            $vlide->audio_file_name = '';
            
        
            $filePath = 'public/audios'.$vlide->id;
            Storage::putFile('public/audios', $audio);
            $vlide->audio_file_name = $filePath;

    }
    public function updateVlide(string $vlideId, string $title, string $content, int $duration, bool $is_public, array $tag_list)
    {
        return DB::transaction(function () use($vlideId, $title, $content, $duration, $is_public, $tag_list) {

            $vlide = Vlide::where('id', $vlideId)->firstOrFail();

            $vlide->title = $title;
            $vlide->content = $content;
            $vlide->duration = $duration;
            $vlide->is_public = $is_public;

            if( !$vlide->published_at && $is_public ){ // 初公開日の保存
                // $dateTime = new DateTime();
                $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
                $vlide->published_at = $dateTime->format('Y-m-d H:i:s.v');
            }            

            $vlide->save();

            $tag_id_list = [];
            foreach ($tag_list as $tag_name) {
                // $tag = Tag::firstOrCreate(['name' => $tag_name]);
                // $tag = Tag::firstOrCreate(['name' => $tag_name], ['alias' => strtolower($tag_name)]);
                // $tag = Tag::where('name', $tag_name)->first();
                $tag = Tag::where('name', $tag_name)->first();

                if (empty($tag)) {
                    $tag = Tag::create([
                        'name' => $tag_name,
                        'alias' => strtolower($tag_name),
                    ]);
                }else if(!empty($tag) && $tag->name !== $tag_name) {
                    $tag = Tag::create([
                        'name' => $tag_name,
                        'alias' => strtolower($tag_name),
                    ]);
                }
                $tag_id_list[] = $tag->id;
            }
            $vlide->tags()->sync($tag_id_list);

            // $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            // $created_at = $dateTime->format('Y-m-d H:i:s.v');
            // $vlide->tags()->attach($tag->id, ['created_at' => $created_at]);

            return $vlide->id;
        });
    }

    public function deleteVlide(string $vlideId)
    {
        DB::transaction(function () use($vlideId) {
            $vlide = Vlide::where('id', $vlideId)->firstOrFail();

            $vlide->images()->each(function ($image) {
                $imagePath = 'public/images/'.$image->name;

                if(Storage::disk('s3')->exists($imagePath)) {
                    Storage::disk('s3')->delete($imagePath);
                }
                
                // $vlide->images()->detach($image->id);
                $image->delete();
            });

            if($vlide->audio_file_name){
                $audioPath = 'public/audios/'.$vlide->audio_file_name;
                
                // if(Storage::exists($filePath)) {
                //     Storage::delete($filePath);
                // }
                if(Storage::disk('s3')->exists($audioPath)) {
                    Storage::disk('s3')->delete($audioPath);
                }
            }
            
            $vlide->delete();
        });
    }
    public function saveUnsave(User $user, string $vlideId)
    {
        $vlide = Vlide::where('id', $vlideId)->first();

        if($vlide->isSavedBy($user))
        {
            $vlide->saves()->detach($user->id);
            
            return [
                'id' => $vlide->id,
                'count_saves' => $vlide->count_saves-1,
                'result' => 'unsaved'
            ];
        }
        else
        {
            $vlide->saves()->detach($user->id);
            // $vlide->saves()->attach($user->id);
            $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            $created_at = $dateTime->format('Y-m-d H:i:s.v');
            $vlide->saves()->attach($user->id, ['created_at' => $created_at]);

            return [
                'id' => $vlide->id,
                'count_saves' => $vlide->count_saves+1,
                'result' => 'saved'
            ];
    
        }
    }

}