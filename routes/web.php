<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\StripePaymentsController;
use Illuminate\Http\Request;
use App\Services\VlideService;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/



Route::get('/auth/register', function () {
    return view('index');
});

Route::get('/auth/login', function () {
    return view('index');
})->name('auth.login');

Route::get('/auth/forgot-password', function () {
    return view('index');
});
Route::get('/auth/reset-password', function () {
    return view('index');
});
Route::get('/verification-link-sent', function () {
    return view('index');
})->name('verification-link-sent');

Route::get('/terms', function () {
    return view('index');
});


Route::get('/', function () {
    return view('index');
})->name('home');
Route::get('/clips', function () {
    return view('index');
});
Route::get('/settings', function () {
    return view('index');
});
Route::get('/account', function () {
    return view('index');
});

Route::get('/about', function () {
    return view('index');
});
Route::get('/notifications', function () {
    return view('index');
});
Route::get('/search', function () {
    return view('index');
});
Route::get('/tag', function () {
    return view('index');
});

Route::get('/prof/{username}', function () {
    return view('index');
});

Route::get('/book/{bookId}', function () {
    return view('index');
})->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
Route::get('/book/{bookId}/page/{pageIndex}', function () {
    return view('index');
})->where('pageIndex', '[0-9]+')->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/drafts/book/{bookId}', function () {
    return view('index');
})->where('bookId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');


Route::get('/vlide/{vlideId}', function () {
    return view('index');
})->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/drafts/vlide/{vlideId}', function () {
    return view('index');
})->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/vlide/{vlideId}', function (Request $request, string $vlideId, VlideService $vlideService) {
    $vlide =  $vlideService->retriveVlide($vlideId);
    
    // https://laracasts.com/discuss/channels/laravel/attempt-to-read-property-id-on-null
    // if($vlide->is_public || $vlide->user_id === optional($request->user())->id) {
    if(isset($vlide) && $vlide->is_public) {
        return view('index')->with([
            "vlide" => $vlide,
        ]);
    }else{
        return view('index');
    }

    // return view('index')->with([
    //     "vlide" => $vlide,
    // ]);
})
->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/clip/{clipId}', function () {
    return view('index');
})->where('clipId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::prefix('/payment')->group(function (){
    Route::get('/success', function () {
        return view('index');
    })->name('stripe.index');

    Route::get('/cancellation', function () {
        return view('index');
    })->name('stripe.cancellation');
});

// Route::get('/subscription', function () {
//     return view('index');
// })->middleware(['auth'])->name('subscription');

// Route::prefix('payment')->group(function (){
//     Route::get('/', [StripePaymentsController::class, 'index'])->name('stripe.index');

//     Route::get('/payment', [StripePaymentsController::class, 'payment'])->name('stripe.payment');

//     Route::get('/complete', [StripePaymentsController::class, 'complete'])->name('stripe.complete');
// });

require __DIR__.'/auth.php';


Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');