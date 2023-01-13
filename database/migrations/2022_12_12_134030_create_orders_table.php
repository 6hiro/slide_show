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
        Schema::create('orders', function (Blueprint $table) {
            // $table->uuid('id')->primary();
            $table->id();
            $table->string('status');
            $table->decimal('total_price', 15, 2);
            $table->string('session_id');
            $table->foreignUuid('user_id')->constrained();
            // $table->uuid('user_id');
            // $table->foreign('user_id')->references('id')->on('users');
            $table->foreignId('payment_id')->nullable()->constrained();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
