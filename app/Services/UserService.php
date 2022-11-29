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

class UserService
{
    public function getSearch(string $word, int $per_page, ?string $since)
    {
        if($since){
            $users = User::where(function($q) use ($word) {
                    $q->where('name', 'like', "%{$word}%")
                    ->orWhere('nick_name', 'like', "%{$word}%");
                })
                ->where('email_verified_at', '<', $since)
                ->latest('email_verified_at')
                ->take($per_page+1) // 次のページがあるか判断するために、1 つ多めにとる
                ->get();
        }else{
            $users = User::where(function($q) use ($word) {
                    $q->where('name', 'like', "%{$word}%")
                    ->orWhere('nick_name', 'like', "%{$word}%");
                })
                ->latest('email_verified_at')
                ->take($per_page+1)
                ->get();
        }

        return $users;
    }
    public function getRankSearch(string $word, int $per_page, ?string $since)
    {
        $users = User::where(function($q) use ($word) {
                $q->where('name', 'like', "%{$word}%")
                ->orWhere('nick_name', 'like', "%{$word}%");
            })
            ->where('email_verified_at', '>', $since)
            ->withCount('followers')
            ->orderBy('followers_count', 'desc')
            ->latest('email_verified_at')
            ->paginate($per_page);
        return $users;
    }
    public function followUnfollow(User $user, string $userId)
    {
        $targetUser = User::where('id', $userId)->first();

        if($targetUser->isFollowedBy($user))
        {
            $user->followings()->detach($targetUser);

            
            return [
                'id' => $targetUser->id,
                'count_followers' => $targetUser->count_followers-1,
                'result' => 'unfollowed'
            ];
        }
        else
        {
            $user->followings()->detach($targetUser->id);
            // $user->followings()->attach($targetUser);
            
            $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
            $created_at = $dateTime->format('Y-m-d H:i:s.v');
            $user->followings()->attach($targetUser->id, ['created_at' => $created_at]);

            return [
                'id' => $targetUser->id,
                'count_followers' => $targetUser->count_followers+1,
                'result' => 'followed'
            ];
    
        }
    }

}
