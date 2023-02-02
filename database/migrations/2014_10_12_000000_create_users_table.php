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
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            // $table->string('role');
            
            $table->date('date_of_birth')->nullable(); // YYYY-MM-DD

            $table->string('nick_name');
            $table->text('description')->nullable();
            $table->string('file_name')->nullable();
            // $table->string('is_superuser')->nullable();
            $table->string('status')->nullable();

            // $table->foreignId('plan_id')->nullable();
            // $table->string('customer_id')->nullable()->index();
            $table->string('stripe_id')->nullable()->index(); // customer_id
            $table->dateTime('ends_at')->nullable();


            $table->string('email')->unique();
            $table->dateTime('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->date('unbaned_on')->nullable(); // YYYY-MM-DD

            /**
             * Illuminate\Database\Schema
             * Create a new date-time column on the table.
             *
             *  string  $column
             *  int|null  $precision
             */
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
        Schema::dropIfExists('users');
    }
};
