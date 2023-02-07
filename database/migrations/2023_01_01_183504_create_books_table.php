<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBooksTable  extends Migration
// return new class extends Migration
{
    /**
     * Run the migrations.
     * sail artisan make:migration create_tickets_table
     *
     * @return void
     */
    public function up()
    {
        Schema::create('books', function (Blueprint $table) {
            // $table->id();
            $table->uuid('id')->primary();
            $table->string('title', '50');
            $table->text('overview')->nullable();
            $table->string('book_type')->nullable(); 

            $table->string('img_file_name')->nullable();
            $table->boolean('is_public')->default(false);     
               
            $table->dateTime('published_at', 3)->nullable();

            // Foreign key.
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
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
        Schema::dropIfExists('books');
    }
};
