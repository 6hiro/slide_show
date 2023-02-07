<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();

            // Foreign key.
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Foreign key.
            $table->uuid('clip_id');
            $table->foreign('clip_id')->references('id')->on('clips')->onDelete('cascade');

            $table->dateTime('created_at', 3)->nullable();
            // $table->dateTime('updated_at', 3)->nullable();
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
        Schema::dropIfExists('likes');
    }
};