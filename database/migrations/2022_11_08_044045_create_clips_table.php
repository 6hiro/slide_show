<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClipsTable extends Migration
// return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clips', function (Blueprint $table) {
            // https://laravel.com/docs/9.x/migrations#column-method-nullableUuidMorphs
            // $table->nullableUuidMorphs('clipable');

            $table->uuid('id')->primary();
            // clip_type : Postのタイプ(clip, QqotePost, Reclip, reply)
            $table->string('clip_type')->nullable(); 
            $table->uuid('parent_id')->nullable();

            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // ReClipの場合は、null
            $table->text('content')->nullable();

            $table->text('quote')->nullable();

            $table->boolean('is_public')->default(false);

            $table->uuid('vlide_id')->nullable();
            $table->foreign('vlide_id')->references('id')->on('vlides')->onDelete('set null');
            
            // ミリ秒
            $table->dateTime('created_at', 3)->nullable();
            $table->dateTime('updated_at', 3)->nullable();
            
            $table->collation = 'utf8mb4_bin';
        });

        Schema::table('clips', function (Blueprint $table) 
        {
            $table->foreign('parent_id')->references('id')
                ->on('clips')->onUpdate('cascade')->onDelete('set null');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clips');
    }
};