<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Collection;

class Clip extends Model
{
    use HasFactory;
    use HasUuids;

    // public $timestamps = false;

    protected $fillable = [
        'content', 
        // 'is_public'
    ];
    // カラムの型を指定
    // protected $casts = [
    // ];
    
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d H:i:s.v';

    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s.v',
        'updated_at' => 'datetime:Y-m-d H:i:s.v',
        'is_public' => 'boolean',
    ];

    
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }
    public function parent(): BelongsTo
    {
        return $this->belongsTo('App\Models\Clip', 'parent_id')
            // ->with(["user"]);
            ->with(['user' => function ($query) {
                $query->select('id', 'name', 'nick_name', 'file_name', 'email_verified_at');
            }]);
    }
    // public function parent_parent()
    // {
    //     return $this->belongsTo('App\Models\Clip', 'parent_id')
    //         // ->select('id')
    //         ->with(['user' => function ($query) {
    //             $query->select('id', 'name');
    //         }])
    //         ->get();
    // }

    public function children(): HasMany
    {
        return $this->hasMany('App\Models\Clip', 'parent_id');
    }
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'likes')
            ->withPivot([
                'created_at',
                // 'updated_by',
            ]); 
        // ;
        // ->withTimestamps(3);
    }
    public function isLikedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->likes->where('id', $user->id)->count()
            : false;
    }
    public function LikedAt(?User $user): string | null
    {        
        return $this->isLikedBy($user) 
            ? $this->likes->where('id', $user->id)->first()->pivot['created_at'] 
            : null;

    }
    public function getCountLikesAttribute(): int
    {
        return $this->likes->count();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Tag', 'clip_tag')
            ->withPivot([
                'created_at',
            ]); 
        // ->withTimestamps();
    }

    public function replies(): HasMany
    {
        return $this->hasMany('App\Models\Clip', 'parent_id')
                    ->where('clip_type', 'reply')
                    // ->orderBy('created_at', 'desc');
                    ->withCount('likes')
                    ->orderBy('likes_count', 'desc');
    }
    
    public function getCountRepliesAttribute(): int
    // このメソッドを使う時は、$clip->count_replies
    {
        return $this->replies->count();
    }
    
    public function reclips(): HasMany
    {
        return $this->hasMany('App\Models\Clip', 'parent_id')
                    ->where('clip_type', 'reclip')
                    ->orderBy('created_at', 'desc');
    }

    public function getCountReclipsAttribute(): int
    // このメソッドを使う時は、$clip->count_reclips
    {
        return $this->reclips->count();
    }

    public function reclipUsers(): HasMany
    {
        return $this->hasMany('App\Models\Clip', 'parent_id')
            ->where('clip_type', 'reclip')
            // ->with(['user' => function($query){
            //     $query->groupBy('id');
            // }])
            ->orderBy('created_at', 'desc');
    }
}
