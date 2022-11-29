<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Vlide;
use App\Models\Image;


class VlidesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Vlide::factory()->count(10)->create()->each(fn($vlide) => 
            Image::factory()->count(4)->create()->each(fn($image) => 
                $vlide->images()->attach($image->id)
            )
        );

    }
}
