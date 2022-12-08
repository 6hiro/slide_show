<?php
// https://arrown-blog.com/php-laravel-stripe-creditcard/
// https://biz.addisteria.com/laravel-stripe-subscription-10steps/
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Charge;


class StripePaymentsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'intent' => $user->createSetupIntent(),
            'stripe-public-key' => config('services.stripe.pb_key'),
        ], 200);
    }

    public function payment(Request $request)
    {
        try
        {
            Stripe::setApiKey(env('STRIPE_SECRET'));

            $customer = Customer::create(array(
                'email' => $request->stripeEmail,
                'source' => $request->stripeToken
            ));

            $charge = Charge::create(array(
                'customer' => $customer->id,
                'amount' => $request->amount,
                // 'amount' => 2000,
                'currency' => 'jpy'
            ));

            return redirect()->route('complete');
        }
        catch(Exception $e)
        {
            return $e->getMessage();
        }
    }

    public function complete()
    {
        return view('complete');
    }

    public function afterpay(Request $request){
        // ログインユーザーを$userとする
        $user=Auth::user();
 
        // またStripe顧客でなければ、新規顧客にする
        $stripeCustomer = $user->createOrGetStripeCustomer();
 
        // フォーム送信の情報から$paymentMethodを作成する
        $paymentMethod=$request->input('stripePaymentMethod');
 
        // プランはconfigに設定したbasic_plan_idとする
        $plan=config('services.stripe.basic_plan_id');
        
        // 上記のプランと支払方法で、サブスクを新規作成する
        $user->newSubscription('default', $plan)
        ->create($paymentMethod);
 
        // 処理後に'ルート設定'にページ移行
        return redirect()->route('ルート設定');
    }
}