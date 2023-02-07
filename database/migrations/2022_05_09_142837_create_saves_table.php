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
        Schema::create('saves', function (Blueprint $table) {
            $table->id();

            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->uuid('vlide_id');
            $table->foreign('vlide_id')->references('id')->on('vlides')->onDelete('cascade');

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
        Schema::dropIfExists('saves');
    }
};
