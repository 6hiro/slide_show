<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// use Laravel\Cashier\Billable;

use App\Notifications\ResetPasswordNotification;
use App\Notifications\VerifyEmailJP;


class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;
    use HasUuids;
    // use Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'nick_name',
        // 'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $dates = [
        'ends_at',
    ];

    // public function getDateFormat()
    // {
    //     return 'Y-m-d H:i:s.v';
    // }
    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d H:i:s.v';

    public function sendEmailVerificationNotification()
    {
        // $this->notify(new VerifyEmail);
        $this->notify(new VerifyEmailJP);
        // $this->notify(new EmailVerificationNotification($url));

    }

    public function sendPasswordResetNotification($token)
    {

        $url = env('FRONTEND_URL') . '/auth/reset-password/' . $token;
        // $url = env('FRONTEND_URL') . '/auth/reset-password?token=' . $token;

        $this->notify(new ResetPasswordNotification($url));
    }

    // Follow関係
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'followee_id', 'follower_id')
            ->withPivot([
                'created_at',
            ]);
        // ->withTimestamps();
    }
    public function followings(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'follows', 'follower_id', 'followee_id')
            ->withPivot([
                'created_at',
            ]); 
        // ->withTimestamps();

    }
    public function isFollowedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->followers->where('id', $user->id)->count()
            : false;
    }
    public function getCountFollowersAttribute(): int
    // アクセサ（このメソッドを使う時は、$user->count_followers）
    {
        return $this->followers->count();
    }
    public function getCountFollowingsAttribute(): int
    // アクセサ（このメソッドを使う時は、$user->count_followings）
    {
        return $this->followings->count();
    }
    // Book 関係
    public function books(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Book');
    }
    public function tickets(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Book', 'tickets')
            ->withPivot(['created_at', 'is_admitted'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    public function isAdmitted(string $book_id): bool
    {
        $ticket = $this->tickets->where('id', $book_id)->first();

        if(!$ticket) return false;

        return $ticket->pivot->is_admitted;
    }

    // Vlide 関係
    public function vlides(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Vlide');
    }

    public function publicVlides(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Vlide')->where('is_public', true);
    }

    public function images(): HasMany
    {
        return $this->hasMany('App\Models\Image');
    }

    public function getCountVlidesAttribute(): int
    {
        return $this->vlides->count();
    }


    public function getCountPublicVlidesAttribute(): int
    {
        return $this->publicVlides->count();
    }

    public function saves(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Vlide', 'saves')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    
    // Clip 関係
    public function clips(): HasMany
    // ユーザーと、そのユーザーの投稿は1対多の関係
    {
        return $this->hasMany('App\Models\Clip');
    }


    public function likes(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Clip', 'likes')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }

    public function isActive()
    {
        return $this->ends_at->gt(now());
    }


    
}
