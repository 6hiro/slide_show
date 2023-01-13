<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
// use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Plan extends Model
{
    use HasFactory;
    // use HasUuids;

    protected $fillable = [
        'name',
        'price',
        'interval',
        'trial_period_days',
        'lookup_key',
        'st_plan_id'
    ];
}
