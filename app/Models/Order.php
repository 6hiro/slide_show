<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasFactory;
    // use HasUuids;

    protected $fillable = [
        'status',
        'total_price',
        'session_id',
        'user_id',
        'payment_id',
    ];
}
