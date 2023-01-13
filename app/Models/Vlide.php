<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use DateTime;
use DateTimeZone;

// use Ramsey\Uuid\Uuid;
// sail artisan make:model Vlide 
class Vlide extends Model
{
    use HasFactory;
    use HasUuids;


    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d H:i:s.v';


    protected $casts = [
        'created_at' => 'datetime:Y-m-d H:i:s.v',
        'updated_at' => 'datetime:Y-m-d H:i:s.v',
        // 'published_at' => 'datetime:Y-m-d H:i:s.v',
        // https://rapicro.com/laravel_cast_boolean/
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Tag', 'vlide_tag')
            ->withPivot([
                'created_at',
            ]); 
        // ->withTimestamps();
    }

    public function saves(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'saves')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    public function isSavedBy(?User $user): bool
    {
        return $user
            ? (bool)$this->saves->where('id', $user->id)->count()
            : false;
    }
    public function savedAt(?User $user): string | null
    {        
        return $this->isSavedBy($user) 
            ? $this->saves->where('id', $user->id)->first()->pivot['created_at'] 
            : null;

    }
    public function getCountSavesAttribute(): int
    {
        return $this->saves->count();
    }
    // public function vlides(): HasMany
    // {
    //     return $this->hasMany('App\Models\Vlide');
    // }

    // public function images(): BelongsToMany
    // {
    //     // using リレーションの中間テーブルを表す、カスタムモデルを定義
    //     return $this->belongsToMany(Image::class, 'vlide_image')
    //         ->using(VlideImage::class);
    // }
    public function images(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Image', 'vlide_image')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    public function getCountImagesAttribute(): int
    // アクセサ（このメソッドを使う時は、$vlide->count_images）
    {
        return $this->images->count();
    }
    // Clip関係
    public function clips(): HasMany
    {
        return $this->hasMany('App\Models\Clip');
    }
    public function getCountClipsAttribute(): int
    {
        return $this->clips->count();
    }
    public function oneWeekclips(): HasMany
    {
        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        $since = $dateTime->modify('-1 week')->format('Y-m-d H:i:s.v');
        $until = $dateTime->modify('-20 minute')->format('Y-m-d H:i:s.v');
        
        return $this
            ->hasMany('App\Models\Clip')
            ->where('created_at', '>', $since) 
            ->where('created_at', '<', $until);
    }
}
