<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVlideTagTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vlide_tag', function (Blueprint $table) {
            $table->id();
            
            $table->uuid('vlide_id');
            $table->foreign('vlide_id')->references('id')->on('vlides')->onDelete('cascade');

            $table->uuid('tag_id');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');

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
        Schema::dropIfExists('vlide_tag');
    }
};