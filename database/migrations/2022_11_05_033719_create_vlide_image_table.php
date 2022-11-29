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
        Schema::create('vlide_image', function (Blueprint $table) {
            $table->id();
            // $table->uuid('id')->primary();
            $table->uuid('vlide_id');
            $table->foreign('vlide_id')->references('id')->on('vlides')->onDelete('cascade');

            $table->uuid('image_id');
            $table->foreign('image_id')->references('id')->on('images')->onDelete('cascade');
            
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
        Schema::dropIfExists('vlide_image');
    }
};
