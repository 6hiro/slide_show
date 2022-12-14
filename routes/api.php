<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Vlide;
use App\Http\Controllers\Clip;
use App\Http\Controllers\User;
use App\Http\Controllers\Auth;
use App\Http\Controllers\StripePaymentsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::prefix('v1')->group(function (){
    
    Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
        // User
        Route::prefix('user')->group(function (){
            Route::get('/', Auth\IndexController::class)->name('vlide.auth.user');
            Route::patch('/change-password', Auth\ChangePasswordController::class)->name('user.changePassword');

            Route::patch('/',  Auth\ChangeUserNameController::class)->name('user.updateUserName');
            Route::patch('/prof',  User\UpdateController::class)->name('user.updateProf');
            Route::put('/{userId}/follow',  User\FollowUnfollowController::class)->name('followUnfollow');
            Route::delete('/',  Auth\DeleteAccountController::class)->name('user.delete');
            // For Feed Page
            Route::get('/followings/vlides', Vlide\FollowingsController::class)->name('followings.vlide');
            Route::get('/followings/clips', Clip\FollowingsController::class)->name('followings.clips');
        });

        // stripe
        Route::prefix('payment')->group(function (){
            Route::get('/setup-intent', [StripePaymentsController::class, 'index'])->name('vlide.auth.user');
        });
        
        Route::prefix('vlide')->group(function (){
            Route::get('/{vlideId}/draft', Vlide\RetrieveDraftController::class)->name('vlide.retrieve.draft')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

            Route::post('/', Vlide\CreateController::class)->name('vlide.create');

            Route::group(['middleware' => ['throttle:upload']], function(){
                Route::post('/{vlideId}/audio', Vlide\UploadAudioController::class)->name('vlide.upload.audio')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
                Route::delete('/{vlideId}/audio', Vlide\DeleteAudioController::class)->name('vlide.delete.audio');
            });
            
            
            Route::put('/{vlideId}', Vlide\UpdateController::class)->name('vlide.update')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::delete('/{vlideId}', Vlide\DeleteController::class)->name('vlide.delete');
            Route::put('{vlideId}/save', Vlide\SaveUnsaveController::class)->name('vlide.saveUnsave');
        });

        Route::prefix('clip')->group(function (){
            Route::post('/{vlideId}', Clip\CreateController::class)->name('clip.create')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::delete('/{clipId}', Clip\DeleteController::class)->name('clip.delete');
            // ->where('clipId', '[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}');
            Route::put('/{clipId}/like', Clip\LikeUnlikeController::class)->name('clip.likeUnlike');
            Route::post('/share/{parent_id}', Clip\ShareController::class)->name('clip.share');
            Route::post('/unshare/{clip_id}', Clip\UnShareController::class)->name('clip.unShare');

            Route::post('/reply/{clipId}', Clip\AddReplyController::class)->name('clip.reply')->where('clipId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

            
        });
    });
    
    Route::prefix('audio')->group(function (){
        Route::get('/', Vlide\GetAudioController::class)->name('vlide.audio');
    });

    Route::prefix('user')->group(function (){
        Route::get('{username}', User\RetrieveController::class)->name('user.retrieve');
        Route::get('{userId}/vlides', Vlide\UserController::class)->name('user.vlides');
        Route::get('/{userId}/saves', Vlide\UserSavesController::class)->name('user.saves');
        Route::get('/{userId}/clips', Clip\UserController::class)->name('user.clips');
        Route::get('/{userId}/likes', Clip\UserLikesController::class)->name('user.likes');
        Route::get('/followings/{userId}',  User\FollowingsController::class)->name('auth.followings');
        Route::get('/followers/{userId}',  User\FollowersController::class)->name('auth.followers');
    });

    Route::prefix('search')->group(function (){
        Route::prefix('vlide')->group(function (){
            Route::get('/rank', Vlide\RankSearchController::class)->name('vlide.search.rank');
            Route::get('/latest', Vlide\LatestSearchController::class)->name('vlide.search.latest');
        });
        Route::prefix('clip')->group(function (){
            Route::get('/rank', Clip\RankSearchController::class)->name('clip.search.rank');
            Route::get('/latest', Clip\LatestSearchController::class)->name('clip.search.latest');
        });
        Route::prefix('user')->group(function (){
            Route::get('/rank', User\RankSearchController::class)->name('user.search.rank');
            Route::get('/latest', USer\LatestSearchController::class)->name('user.search.latest');
        });
    });

    Route::prefix('tag')->group(function (){
        Route::prefix('vlide')->group(function (){
            Route::get('/rank', Vlide\RankTagController::class)->name('vlide.tag.rank');
            Route::get('/latest', Vlide\LatestTagController::class)->name('vlide.tag.latest');
        });
        Route::prefix('clip')->group(function (){
            Route::get('/rank', Clip\RankTagController::class)->name('clip.tag.rank');
            Route::get('/latest', Clip\LatestTagController::class)->name('clip.tag.latest');
        });
        Route::prefix('user')->group(function (){
            Route::get('/rank', User\RankSearchController::class)->name('user.tag.rank');
            Route::get('/latest', USer\LatestSearchController::class)->name('user.tag.latest');
        });
    });

    Route::prefix('clip')->group(function (){
        Route::get('/', Clip\IndexController::class)->name('clip.index');
        Route::get('/{clipId}', Clip\RetrieveController::class)->name('clip.retrieve');
        Route::get('/vlide/{vlideId}', Clip\VlideController::class)->name('clip.vlide')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
        // Route::get('{vlideId}/like/users', Clip\LikedByController::class)->name('clip.like.users');
    });
    Route::prefix('vlide')->group(function (){
        Route::get('/', Vlide\IndexController::class)->name('vlide.index');
        Route::get('/{vlideId}', Vlide\RetrieveController::class)->name('vlide.retrieve')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

        Route::get('/user/{userId}', Vlide\UserController::class)->name('vlide.user')->where('userId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
        
        Route::get('/rank', Vlide\RankController::class)->name('vlide.rank');

    });

});

