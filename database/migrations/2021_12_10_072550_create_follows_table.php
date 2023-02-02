<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFollowsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_admitted')->default(true);        

            // Foreign key.
            $table->uuid('follower_id');
            $table->foreign('follower_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->uuid('followee_id');
            $table->foreign('followee_id')->references('id')->on('users')->onDelete('cascade');

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
        Schema::dropIfExists('follows');
    }
};
