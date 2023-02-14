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
        Schema::create('plans', function (Blueprint $table) {
            // $table->uuid('id')->primary();
            $table->id();
            $table->string('name', 255);
            $table->decimal('price', 7);
            // $table->integer('price')->unsigned(); //Without decimals
            $table->string('interval');
            $table->integer('trial_period_days');
            $table->string('lookup_key', 255);
            $table->string('st_plan_id', 255);
            $table->dateTime('created_at')->nullable();
            $table->dateTime('updated_at')->nullable();
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
        Schema::dropIfExists('plans');
    }
};
