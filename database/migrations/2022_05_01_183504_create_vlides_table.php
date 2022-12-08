<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVlidesTable  extends Migration
// return new class extends Migration
{
    /**
     * Run the migrations.
     * sail artisan make:migration create_vlides_table
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vlides', function (Blueprint $table) {
            // $table->id();
            $table->uuid('id')->primary();
            $table->string('title', '80');
            $table->text('content')->nullable();
            // $table->text('overview')->nullable();
            $table->integer('duration');
            $table->string('audio_file_name')->nullable();

            $table->string('heading_file_name')->nullable();
            $table->boolean('need_payment')->default(false);

            $table->boolean('is_public')->default(false);            
            $table->dateTime('published_at', 3)->nullable();

            // Foreign key.
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vlides');
    }
};
