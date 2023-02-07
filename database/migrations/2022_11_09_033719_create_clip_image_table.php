<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clip_image', function (Blueprint $table) {
            $table->id();
            // $table->uuid('id')->primary();
            $table->uuid('clip_id');
            $table->foreign('clip_id')->references('id')->on('clips')->onDelete('cascade');

            $table->uuid('image_id');
            $table->foreign('image_id')->references('id')->on('images')->onDelete('cascade');
            
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            $table->collation = 'utf8mb4_bin';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clip_image');
    }
};
