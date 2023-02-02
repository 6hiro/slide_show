<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Image;
use App\Http\Controllers\Book;
use App\Http\Controllers\Vlide;
use App\Http\Controllers\Clip;
use App\Http\Controllers\User;
use App\Http\Controllers\Auth;
use App\Http\Controllers\Embed;
use App\Http\Controllers\StripePayment;
// use App\Models\Payment;
// use App\Models\user as U;
// use Illuminate\Support\Facades\Auth as A;

// app/Http/Controllers/Payment/PaymentController.php

// use App\Http\Controllers\StripePaymentsController;

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
    
    // Route::get('/date', function () {
    //     $user = U::find(A::id());

    //     $payment = Payment::where('st_cus_id', "cus_NGqcXV2FX3Fpuy")
    //         ->where('st_payment_status', 'paid')
    //         ->orderBy('created_at', 'desc')
    //         ->first();
    //     if(!isset($user->file_name)) return ;
    //     return [
    //         "a" => $user->file_name,
    //         // "payment" => $payment->st_cus_id,
    //         // "end" => date("Y-m-d H:i:s", "1677587232"),
    //         // "current" => date("Y-m-d H:i:s"),
    //         // "calc" =>  date("Y-m-d H:i:s", "1677587232") > date("Y-m-d H:i:s"),
    //         // "a" => DateTime::createFromFormat('Y-m-d H:i:s',  date("Y-m-d H:i:s", "1677587232"), new DateTimeZone('Asia/Tokyo'))->format('Y-m-d H:i:s')
    //     ];
    // });
    Route::get('/checkout/success', [StripePayment\PaymentController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [StripePayment\PaymentController::class, 'cancelOrder'])->name('checkout.cancel');

    Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
        // User
        Route::prefix('user')->group(function (){
            Route::get('/', Auth\IndexController::class)->name('vlide.auth.user');
            Route::patch('/change-password', Auth\ChangePasswordController::class)->name('user.changePassword');

            Route::patch('/',  Auth\ChangeUserNameController::class)->name('user.updateUserName');

            Route::put('/{userId}/follow',  User\FollowUnfollowController::class)->name('followUnfollow');
            Route::delete('/',  Auth\DeleteAccountController::class)->name('user.delete');
            // Feed Page
            Route::get('/followings/vlides', Vlide\FollowingsController::class)->name('followings.vlide');
            Route::get('/followings/clips', Clip\FollowingsController::class)->name('followings.clips');
            // Prof Page
            Route::patch('/prof',  User\UpdateController::class)->name('user.updateProf');            
            Route::group(['middleware' => ['throttle:upload']], function(){
                Route::post('/prof/icon',  User\UpdateIconController::class)->name('user.updateProfIcon');
                Route::delete('/prof/icon', User\DeleteIconController::class)->name('user.delete.image');
            });
            Route::get('/{userId}/likes', Clip\UserLikesController::class)->name('user.likes');
            Route::get('/followings/{userId}',  User\FollowingsController::class)->name('auth.followings');
            Route::get('/followers/{userId}',  User\FollowersController::class)->name('auth.followers');
            Route::get('/{userId}/images',  Image\UserController::class)->name('user.images');
            Route::get('/{userId}/saves', Vlide\UserSavesController::class)->name('user.saves');        
            Route::get('/{userId}/books', Book\UserController::class)->name('user.books');        

        });
        // book
        Route::prefix('book')->group(function (){
            Route::get('/{bookId}/page/{vlideId}', Book\RetrievePageController::class)
                ->name('book.page.retrieve')
                ->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
                ->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
                // ->where('pageIndex', '[0-9]+');

            Route::get('/{bookId}/ticket/users', Book\TicketsUserController::class)->name('book.ticket.users');
            Route::get('/user/tickets', Book\UserTicketsController::class)->name('book.user.tickets');
            
            Route::get('/{bookId}', Book\RetrieveController::class)->name('book.retrieve')->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::get('/{bookId}/draft', Book\RetrieveDraftController::class)->name('book.retrieve.draft')->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::get('/{bookId}/user/{userId}', Book\UserPageController::class)->name('book.user')
                ->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
                ->where('userId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

            Route::put('/{bookId}/vlide/{vlideId}', Book\SetUnsetPageController::class)->name('book.setUnset')
                ->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
                ->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::post('/change-order', Book\ChangePageOrderController::class)->name('book.change.page.order');

            Route::post('/', Book\CreateController::class)->name('book.create')->middleware('throttle:3, 1');
            Route::put('/{bookId}', Book\UpdateController::class)->name('book.update')->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::delete('/{bookId}', Book\DeleteController::class)->name('book.delete');

            Route::put('/{bookId}/ticket', Book\GetUngetTicketController::class)->name('book.ticket.getUnget');
            Route::put('/{bookId}/ticket/approve', Book\ApproveUnapproveTicketController::class)->name('book.ticket.approveUnpprove');
            
            // Route::group(['middleware' => ['throttle:upload']], function(){
            //     Route::post('/image',  Book\UpdateImageController::class)->name('book.update.image');
            //     Route::delete('/image', Book\DeleteImageController::class)->name('book.delete.image');
            // });
        });

        // stripe
        // Route::prefix('payment')->group(function (){
        //     Route::get('/setup-intent', [StripePaymentsController::class, 'index'])->name('vlide.auth.user');
        // });
        
        Route::prefix('vlide')->group(function (){
            Route::get('/{vlideId}/draft', Vlide\RetrieveDraftController::class)->name('vlide.retrieve.draft')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

            Route::post('/', Vlide\CreateController::class)
                ->name('vlide.create')
                ->middleware('throttle:3, 1');

            Route::group(['middleware' => ['throttle:upload']], function(){
                Route::post('/{vlideId}/audio', Vlide\UploadAudioController::class)->name('vlide.upload.audio')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
                Route::delete('/{vlideId}/audio', Vlide\DeleteAudioController::class)->name('vlide.delete.audio');

                Route::post('/{vlideId}/image', Image\UploadVlideImageController::class)->name('vlide.upload.image')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
                Route::delete('/{vlideId}/image/{imageId}', Image\DeleteVlideImageController::class)->name('vlide.delete.image');
                Route::put('/image/{imageId}', Image\UpdateImageController::class)->name('vlide.update.image');
                Route::put('/{vlideId}/image/{imageId}', Image\SetVlideHeaderController::class)->name('vlide.header.image');
            });
            
            Route::put('/{vlideId}', Vlide\UpdateController::class)->name('vlide.update')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::delete('/{vlideId}', Vlide\DeleteController::class)->name('vlide.delete');
            Route::put('{vlideId}/save', Vlide\SaveUnsaveController::class)->name('vlide.saveUnsave');
        });

        Route::prefix('clip')->group(function (){
            Route::post('/', Clip\CreateController::class)
                ->name('clip.create')
                ->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')
                ->middleware('throttle:3, 1');
            Route::post('/{vlideId}', Clip\CreateController::class)->name('clip.quote.create')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
            Route::delete('/{clipId}', Clip\DeleteController::class)->name('clip.delete');
            // ->where('clipId', '[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}');
            Route::put('/{clipId}/like', Clip\LikeUnlikeController::class)->name('clip.likeUnlike');
            Route::post('/share/{parent_id}', Clip\ShareController::class)->name('clip.share');
            Route::post('/unshare/{clip_id}', Clip\UnShareController::class)->name('clip.unShare');

            Route::post('/reply/{clipId}', Clip\AddReplyController::class)->name('clip.reply')->where('clipId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

            
        });
    });
    
    Route::prefix('audio')->group(function (){
        Route::get('/', Vlide\GetAudioController::class)->name('vlide.audio.retrieve');
    });

    Route::prefix('image')->group(function (){
        Route::get('/', Image\GetImageController::class)->name('vlide.image.retrieve');
    });

    Route::prefix('user')->group(function (){
        Route::get('{username}', User\RetrieveController::class)->name('user.retrieve');
        Route::get('{userId}/vlides', Vlide\UserController::class)->name('user.vlides');
        Route::get('/{userId}/clips', Clip\UserController::class)->name('user.clips');
        Route::get('/{userId}/replies', Clip\UserRepliesController::class)->name('user.replies');
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
        Route::get('{clipId}/like/users', Clip\LikeUsersController::class)->name('clip.like.users');
        Route::get('{clipId}/share/users', Clip\ShareUsersController::class)->name('clip.share.users');
    });
    Route::prefix('vlide')->group(function (){
        Route::get('/', Vlide\IndexController::class)->name('vlide.index');
        Route::get('/{vlideId}', Vlide\RetrieveController::class)->name('vlide.retrieve')->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

        Route::get('/user/{userId}', Vlide\UserController::class)->name('vlide.user')->where('userId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
        
        Route::get('/rank', Vlide\RankController::class)->name('vlide.rank');

    });
    
    Route::get('/embed', Embed\EmbedController::class)->name('embed.embed');

});

// stripe
Route::prefix('payment')->group(function (){
    Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
        Route::get('/plans', [StripePayment\PlanController::class, 'getPlans']);

        Route::post('/checkout/{id}', [StripePayment\PaymentController::class, 'checkout']);
        Route::post('/plan', [StripePayment\PlanController::class, 'createPlan']);
    });
});

Route::prefix('stripe')->group(function (){
    Route::post('/webhook', [StripePayment\PaymentController::class, 'webhook'])->name('stripe.webhook');
});