<?php
// https://github.com/taylorotwell/next-example-backend/tree/master/routes
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;
// use App\Providers\RouteServiceProvider;

// Route::get('/{any?}', function(){ 
//     return view('index')->where('any', '(?!api).+');
// });

Route::post('/register', [RegisteredUserController::class, 'store'])
    ->middleware('guest')
    ->name('register');

// Route::middleware(['throttle:auth'])->group(function(){
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        // ->middleware('guest')
        ->name('login');
// });


Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    // ->name('password.update');
    ->name('password.store');

    // ->name('password.update');
    // ->name('password.);


Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    // ->middleware(['signed', 'throttle:6,1'])
    // ->middleware('auth')
    ->name('verification.verify');

// Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
//     ->middleware(['auth', 'throttle:6,1'])
//     ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
