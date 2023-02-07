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
        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->integer('order');

            // Foreign key.
            $table->uuid('book_id');
            $table->foreign('book_id')->references('id')->on('books')->onDelete('cascade');

            // Foreign key.
            $table->uuid('vlide_id');
            $table->foreign('vlide_id')->references('id')->on('vlides')->onDelete('cascade');

            // $table->dateTime('created_at', 3)->nullable();
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
        Schema::dropIfExists('pages');
    }
};