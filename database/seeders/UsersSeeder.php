<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::factory()->count(10)->create();
        
        // \DB::table('users')->insert([
        //     [
        //         'id' => 'b9f643af-6bad-4b73-8d1e-87aa2e73474e',
        //         'name' => 'admin',
        //         'nick_name' => 'anonymous',
        //         'email' => 'admin@admin.admin',
        //         'email_verified_at' => now(),
        //         'password' => \Hash::make('aabbccdd'),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        //     [
        //         'id' => '7e935307-a62c-428c-bf89-bac0c46fc014',
        //         'name' => 'test1',
        //         'nick_name' => 'anonymous',
        //         'email' => 'test@test.test',
        //         'email_verified_at' => now(),
        //         'password' => \Hash::make('aabbccdd'),
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ],
        // ]);
    }
}
