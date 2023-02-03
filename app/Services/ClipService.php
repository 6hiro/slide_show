<?php

namespace App\Services;

use App\Models\Vlide;
use App\Models\Tag;
use App\Models\Clip;
use App\Models\User;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\ServiceProvider;
use DateTime;
use DateTimeZone;

class ClipService
{
    public function getClips(int $per_page, ?string $since)
    {
        if($since){
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user'])
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $clips = Clip::with(['tags', 'user'])
                ->orderBy('created_at', 'DESC')
                ->take($per_page+1)
                ->get();
        }

        return $clips;
    }
    public function getUserClips(string $user_id, int $per_page, ?string $since)
    {
        if($since){
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->where('clip_type', '!=',  'reply')
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->where('clip_type', '!=',  'reply')
                ->orderBy('created_at', 'DESC')
                ->take($per_page+1)
                ->get();
        }

        return $clips;
    }
    public function getUserReplies(string $user_id, int $per_page, ?string $since)
    {
        if($since){
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->where('clip_type', 'reply')
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])
                ->whereHas('user', function($q) use ($user_id){
                    $q->where('user_id', $user_id);
                })
                ->where('clip_type', 'reply')
                ->orderBy('created_at', 'DESC')
                ->take($per_page+1)
                ->get();
        }

        return $clips;
    }
    public function getUserClipCount(string $userId)
    {
        return Clip::whereHas('user', function($q) use ($userId){
                $q->where('user_id', $userId);
            })->count();
    }

    public function getRank(int $per_page, ?string $since)
    {
        $clips = Clip::with(['tags', 'user', 'replies', 'replies.user'])
            ->where('created_at', '>', $since)
            ->withCount('likes')
            ->orderBy('likes_count', 'desc')
            ->latest('created_at')
            ->paginate($per_page);

        return $clips;
    }

    public function getTag(string $tag_name, int $per_page, ?string $since)
    {
        if($since){
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user'])
                ->whereHas('tags', function($query) use ($tag_name)  {
                    // $query->where('name', $tag_name);
                    $query->where('alias', strtolower($tag_name));
                })
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $clips = Clip::with(['tags', 'user', 'replies', 'replies.user'])
                ->whereHas('tags', function($query) use ($tag_name)  {
                    // $query->where('name', $tag_name);
                    $query->where('alias', strtolower($tag_name));
                })
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }

        return $clips;
    }
    
    public function getRankTag(string $tag_name, int $per_page, ?string $since)
    {
        $clips = Clip::with(['tags', 'user', 'replies', 'replies.user'])
            ->where('created_at', '>', $since)
            ->whereHas('tags', function($query) use ($tag_name)  {
                // $query->where('name', $tag_name);
                $query->where('alias', strtolower($tag_name));
            })
            ->withCount('likes')
            ->orderBy('likes_count', 'desc')
            // ->latest('created_at')
            ->paginate($per_page);
        return $clips;
    }

    public function getSearch(string $word, int $per_page, ?string $since)
    {
        if($since){
            $clips = Clip::where('content', 'like', "%{$word}%")
                ->with(['tags', 'user', 'replies', 'replies.user'])
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $clips = Clip::where('content', 'like', "%{$word}%")
                ->with(['tags', 'user', 'replies', 'replies.user'])
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }

        return $clips;
    }
    public function getRankSearch(string $word, int $per_page, ?string $since)
    {
        $clips = Clip::where('content', 'like', "%{$word}%")
            ->with(['tags', 'user', 'replies', 'replies.user'])
            ->where('created_at', '>', $since)
            ->withCount('likes')
            ->orderBy('likes_count', 'desc')
            // ->latest('created_at')
            ->paginate($per_page);
        return $clips;
    }

    public function getLikes(string $user_id, int $per_page, ?string $since)
    {
        $user = User::where('id', $user_id)->first();
        
        if($since){
            $clips = $user->likes()
                ->where('likes.created_at',  '<', $since)
                ->with(['tags', 'user'])
                ->take($per_page+1)
                ->get();
        }else{
            $clips = $user->likes()->with(['tags', 'user'])
                ->take($per_page+1)
                ->get();
        }
        return $clips;
    }
    
    public function getLikeUsers(string $clipId, int $per_page, ?string $since)
    {
        $clip = Clip::where('id', $clipId)->first();

        if($since){
            $like_users = $clip->likes()
                ->where('likes.created_at',  '<', $since)
                ->latest('likes.created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $like_users = $clip->likes()
                ->latest('likes.created_at')
                ->take($per_page+1)
                ->get();
        }
        return $like_users;
    }
    public function getShareUsers(string $clipId, int $per_page, ?string $since)
    {
        $clip = Clip::where('id', $clipId)->first();

        if($since){
            $share_users = $clip->reclipUsers()
                ->with(['user'])
                // ->groupBy('user_id')
                // ->with(['user' => function($query){
                //     $query->groupBy('name');
                // }])
                ->where('created_at',  '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $share_users = $clip->reclipUsers()
                ->with(['user'])
                // ->with(['user' => function($query){
                //     $query->groupBy('id');
                // }])
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
                // ->pluck('user');
        }
        return $share_users;
    }

    public function followings( string $user_id, int $per_page, ?string $since)
    {
        $user = User::where('id', $user_id)->first();

        if($since){
            $clips = Clip::with(['tags', 'user'])
                ->whereIn('user_id', $user->followings()->pluck('followee_id'))
                ->where('clip_type', '!=',  'reply')
                ->orderByDesc('created_at')
                ->where('created_at', '<', $since)
                ->latest('created_at')
                ->take($per_page+1)
                ->get();
        }else{
            $clips = Clip::with(['tags', 'user'])
                ->whereIn('user_id', $user->followings()->pluck('followee_id'))
                ->where('clip_type', '!=',  'reply')
                ->orderByDesc('created_at')
                ->take($per_page+1)
                ->get();
        }
        return $clips;
    }
    
    public function retrive( string $clip_id)
    {
        return Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])->find($clip_id);;
    }

    public function checkOwnClip(string $userId, string $clipId)
    {
        $clip = Clip::where('id', $clipId)->first();

        if(!$clip){
            return false;
        }
        return $clip->user_id === $userId;
    }

    public function create(string $userId, ?string $vlide_id, bool $is_public, ?string $content, ?string $quote)
    {
        
        return DB::transaction(function () use($userId, $vlide_id, $is_public, $content, $quote) {

            $clip = new Clip();
            $clip->clip_type = "clip";
            $clip->user_id = $userId;
            $clip->content = $content;
            $clip->quote = $quote;

            $clip->is_public = $is_public;
            if($vlide_id){
                $clip->vlide_id = $vlide_id;
            }
            $clip->save();

            //　contentを空白で分割し、リスト化
            $sentence_list = preg_split('/[\p{Z}\p{Cc}]++/u', $content, -1, PREG_SPLIT_NO_EMPTY);

            // タグの保存
            // foreach ($sentence_list as $sentence) {
            //     $pattern = '/^#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+$/u'; // 半角全角英数字カタカナひらがな漢字　uオプションをつけないと、Javascriptとずれが生じる

            //     if(  preg_match( $pattern, $sentence ) ){
            //         // firstOrCreateメソッドで、既にtagがテーブルに存在していれば、そのモデルを返し、
            //         // テーブルに存在しなければ、そのレコードをテーブルに保存した上で、モデルを返す。
            //         // $tag = Tag::firstOrCreate(['name' => substr($sentence, 1)], ['alias' => strtolower(substr($sentence, 1))]);
            //         // $clip->tags()->attach($tag);
            //         // $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            //         // $created_at = $dateTime->format('Y-m-d H:i:s.v');
            //         // $clip->tags()->attach($tag->id, ['created_at' => $created_at]);
            //     }
            // }

            $tag_id_list = [];
            foreach ($sentence_list as $sentence) {
                $pattern = '/^#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+$/u'; // 半角全角英数字カタカナひらがな漢字　uオプションをつけないと、Javascriptとずれが生じる
                if(  preg_match( $pattern, $sentence ) ){
                    // $tag = Tag::where('name', substr($sentence, 1))->first();
                    // $tag = Tag::where(DB::raw('BINARY `name`'), substr($sentence, 1))->first();
                    $tag = Tag::where(DB::raw('BINARY `name`'), substr($sentence, 1))->first();

                    // if (empty($tag)) {
                    if (empty($tag)) {                    
                        $tag = Tag::create([
                            'name' => substr($sentence, 1),
                            'alias' => strtolower(substr($sentence, 1)),
                        ]);
                    }
                    // else if($tag && $tag->name !== substr($sentence, 1)) {
                    //     $tag = Tag::create([
                    //         'name' => substr($sentence, 1),
                    //         'alias' => strtolower(substr($sentence, 1)),
                    //     ]);
                    // }
                    $tag_id_list[] = $tag->id;
                }
            }
            $clip->tags()->sync($tag_id_list);
            
            return $clip;
        });

    }
    public function delete(string $clip_id)
    {
        return DB::transaction(function () use($clip_id) {

            $clip = Clip::where('id', $clip_id)->firstOrFail();

            $clip_id_array = $clip->reclips()->pluck('id')->toArray();

            // Clip::destroy($clip_id_array);
            Clip::whereIn('id', $clip_id_array)->delete();

            // $clip->reclips()->each(function ($reclip) use ($clip) {
            //     $reclip->delete();
            // });
            // $clip_id->images()->each(function ($image) use ($clip) {
            //     $filePath = 'public/images'.$clip->name;
            //     if(Storage::exists($filePath)){
            //         Storage::delete($filePath);
            //     }
            //     $clip->images()->detach($image->id);
            //     $image->delete();
            // });
            $clip->delete();
        });
    }
    public function likeUnlike(User $user, string $clip_id)
    {
        $clip = Clip::where('id', $clip_id)->first();

        if($clip->isLikedBy($user))
        {
            $clip->likes()->detach($user->id);
            
            return [
                'id' => $clip->id,
                'count_likes' => $clip->count_likes-1,
                'result' => 'unlike'
            ];
        }
        else
        {
            $clip->likes()->detach($user->id);

            $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            $created_at = $dateTime->format('Y-m-d H:i:s.v');
            $clip->likes()->attach($user->id, ['created_at' => $created_at]);


            return [
                'id' => $clip->id,
                'count_likes' => $clip->count_likes+1,
                'result' => 'like'
            ];
    
        }
    }

    public function share(string $user_id, string $parent_id)
    {
        $clip = new Clip;
        $clip->parent_id = $parent_id;
        $clip->clip_type = "reclip";
        $clip->user_id = $user_id;
        $clip->save();

        return Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])->find($clip->id);

        // return $clip;
    }
    public function unshare(string $clip_id)
    {
        $clip = Clip::where('id', $clip_id)->firstOrFail();

        return $clip->delete();

    }

    
    public function addReply(string $userId, string $clipId, bool $is_public, string $content)
    {
        return DB::transaction(function () use($userId, $clipId, $is_public, $content) {
            $clip = new Clip();

            $clip->parent_id = $clipId;
            $clip->clip_type = "reply";
            $clip->user_id = $userId;
            $clip->content = $content;
            $clip->is_public = $is_public;
            $clip->parent_id = $clipId;
            $clip->save();

            //　contentを空白で分割し、リスト化
            $sentence_list = preg_split('/[\p{Z}\p{Cc}]++/u', $content, -1, PREG_SPLIT_NO_EMPTY);

            // タグの保存
            // foreach ($sentence_list as $sentence) {
            //     $pattern = '/^#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+$/u'; // 半角全角英数字カタカナひらがな漢字　uオプションをつけないと、Javascriptとずれが生じる

            //     if(  preg_match( $pattern, $sentence ) ){
            //         // firstOrCreateメソッドで、既にtagがテーブルに存在していれば、そのモデルを返し、
            //         // テーブルに存在しなければ、そのレコードをテーブルに保存した上で、モデルを返す。
            //         // $tag = Tag::firstOrCreate(['name' => substr($sentence, 1)]);
            //         $tag = Tag::firstOrCreate(['name' => substr($sentence, 1)], ['alias' => strtolower(substr($sentence, 1))]);
            //         // $clip->tags()->attach($tag);
            //         $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            //         $created_at = $dateTime->format('Y-m-d H:i:s.v');
            //         $clip->tags()->attach($tag->id, ['created_at' => $created_at]);
            //     }
            // }

            $tag_id_list = [];
            foreach ($sentence_list as $sentence) {
                $pattern = '/^#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+$/u'; // 半角全角英数字カタカナひらがな漢字　uオプションをつけないと、Javascriptとずれが生じる
                if(  preg_match( $pattern, $sentence ) ){
                    $tag = Tag::where('name', substr($sentence, 1))->first();
                    // $tag = Tag::where(DB::raw('BINARY `name`'), substr($sentence, 1))->first();

                    if (empty($tag)) {
                        $tag = Tag::create([
                            'name' => substr($sentence, 1),
                            'alias' => strtolower(substr($sentence, 1)),
                        ]);
                    }
                    $tag_id_list[] = $tag->id;
                }
            }
            $clip->tags()->sync($tag_id_list);

            return Clip::with(['tags', 'user', 'replies', 'replies.user', 'parent'])->find($clip->id);
            
            // return $clip;
        });
    }

}