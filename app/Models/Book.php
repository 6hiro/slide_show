<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Collection;

class Book extends Model
{
    use HasFactory;
    use HasUuids;

    // public $timestamps = false;

    protected $fillable = [
        'title',
        'overview',
        'book_type',
        'img_file_name',
        'published_at'
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
        'published_at' => 'datetime:Y-m-d H:i:s.v',
        'is_public' => 'boolean',
    ];
    protected $dates = [
        // "Call to a member function format() on string"
        'published_at'
    ];

    
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }
    public function pages(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Vlide', 'pages')
            ->withPivot([
                'id',
                'order'
            ])
            ->orderBy('pivot_order', 'asc');
            // ->withTimestamps();        
    }
    public function hasPageOf(?Vlide $vlide): bool
    {
        return $vlide
            ? (bool)$this->pages->where('id', $vlide->id)->count()
            : false;
    }
    public function getCountVlidesAttribute(): int
    {
        return $this->vlides->count();
    }
    public function tickets(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'tickets')
            ->withPivot(['created_at', 'is_admitted'])
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    public function isGotBy(?User $user): bool
    {
        return $user
            ? (bool)$this->tickets->where('id', $user->id)->count()
            : false;
    }
    public function isAdmitted(?User $user): bool
    {
        if(!$user) return false;

        $ticket = $this->tickets->where('id', $user->id)->first();

        if(!$ticket) return false;
        return $ticket->pivot->is_admitted;
        // return  $this->tickets->where('id', $user->id)->first()->pivot->is_admitted;
    }

    public function getCountTicketsAttribute(): int
    {
        return $this->tickets->count();
    }

    public function validTickets(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\User', 'tickets')
            ->withPivot(['created_at', 'is_admitted'])
            ->whereHas('tickets', function ($q) {
                $q->where('tickets.is_admitted', true);
            })
            ->orderBy('pivot_created_at', 'desc');
            // ->withTimestamps();
    }
    public function getCountValidTicketsAttribute(): int
    {
        return $this->validTickets->count();
    }
}
