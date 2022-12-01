<?php

use Illuminate\Support\Facades\Route;

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



Route::get('/mail', function () {
    return view('emails.changePassword');
});

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

Route::get('/drafts/vlide/{vlideId}', function () {
    return view('index');
})->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
Route::get('/vlide/{vlideId}', function () {
    return view('index');
})->where('vlideId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');

Route::get('/clip/{clipId}', function () {
    return view('index');
})->where('clipId', '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');




require __DIR__.'/auth.php';


Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');