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
        Schema::create('payments', function (Blueprint $table) {
            // $table->uuid('id')->primary();
            $table->id();
            $table->decimal('total', 8, 2)->nullable();
            $table->string('order_id')->nullable();
            $table->string('st_cus_id', 1024)->nullable();
            $table->string('st_sub_id', 1024)->nullable();
            $table->string('st_payment_intent_id', 1024)->nullable();
            $table->string('st_payment_method', 1024)->nullable();
            $table->string('st_payment_status', 1024)->nullable();
            $table->bigInteger('date')->nullable();
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();

            // $table->dateTime('active_until');

            // $table->uuid('user_id');
            // $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // $table->uuid('plan_id');
            // $table->foreign('plan_id')->references('id')->on('plans');

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
        Schema::dropIfExists('payments');
    }
};
