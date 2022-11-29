<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Tag extends Model
{
    use HasFactory;
    use HasUuids;

    /**
     * The storage format of the model's date columns.
     *
     * @var string
     */
    protected $dateFormat = 'Y-m-d H:i:s.v';
    
    // PostControllerのstoreメソッド内のfirstOrCreateを使うときに必要
    protected $fillable = [
        'name'
    ];
    
    public function clips(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Clip')->withTimestamps();        
    }
    public function vlides(): BelongsToMany
    {
        return $this->belongsToMany('App\Models\Vlide')->withTimestamps();        
    }
}
