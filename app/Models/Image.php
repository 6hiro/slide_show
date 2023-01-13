<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Image extends Model
{
    use HasFactory;
    use HasUuids;
    
    protected $fillable = [
        'name',
        'is_public',
        'user_id'
    ];
    /*
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

    public function vlides(): BelongsToMany
    {
        return $this
            ->belongsToMany('App\Models\Vlide', 'vlide_image')
            ->withPivot(['created_at'])
            ->orderBy('pivot_created_at', 'desc')
            ->withTimestamps();
    }

    public function getVlideIdsAttribute()
    {
        return $this->vlides()->pluck("vlides.id");
    }
    
}
