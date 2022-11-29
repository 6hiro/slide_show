<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use DateTime;
use DateTimeZone;

// sail artisan make:factory VlideFactory --model=Vlide
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vlide>
 */
class VlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $userIDs = User::all()->pluck("id")->toArray();
        // echo  User::all()->pluck("id")->toArray();
        $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
        
        return [
            'title' => fake()->text(20),
            'content' => fake()->text(250),
            'duration' => 60,
            'is_public' => true,
            'published_at' => $dateTime->format('Y-m-d H:i:s.v'),
            'user_id' => $userIDs[array_rand($userIDs, 1)]

            //
        ];
    }
}
