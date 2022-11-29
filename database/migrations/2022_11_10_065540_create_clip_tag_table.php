<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClipTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clip_tag', function (Blueprint $table) {
            $table->id();

            $table->uuid('clip_id');
            $table->foreign('clip_id')->references('id')->on('clips')->onDelete('cascade');

            $table->uuid('tag_id');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');

            $table->dateTime('created_at', 3)->nullable();
            // $table->dateTime('updated_at', 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clip_tag');
    }
}
