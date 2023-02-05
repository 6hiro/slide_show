<?php
// https://github.com/AnwarHossainSR/laravel_payments_yt
namespace App\Http\Controllers\StripePayment;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Plan;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

use DateTime;
use DateTimeZone;

class PaymentController extends Controller
{
    // checkout --> URL が返される --> URLからSTRIPEの決算pageに飛び、決済を済ませる --> checkout.success にredirect --> Frontend
    //                          　--> URLからSTRIPEの決算pageに飛び、決済をキャンセル --> checkout.cancel にredirect --> Frontend

    public function checkout(Request $request, $plan_id)
    {
        $plan = Plan::find($plan_id);
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        // $prices = \Stripe\Price::all([
        //     'lookup_keys' => [$request->lookup_key],
        //     'expand' => ['data.product'],
        // ]);
        $lineItems = [[
            'price' => $plan->st_plan_id,
            'quantity' => 1,
        ]];
        // Stripe Checkout
        // https://stripe.com/docs/payments/checkout/how-checkout-works#session
        // https://stripe.com/docs/billing/quickstart
        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            // 'phone_number_collection' => [
            //     'enabled' => true,
            // ],
            'customer_email' => Auth::user()->email,
            'line_items' => $lineItems,
            'mode' => 'subscription',
            'subscription_data' => [
                'trial_from_plan' => true,
            ],
            // https://stripe.com/docs/payments/checkout/custom-success-page#modify-success-url
            'success_url' => route('checkout.success', [], true) . "?session_id={CHECKOUT_SESSION_ID}",
            'cancel_url' => route('checkout.cancel', [], true),
        ]);

        $order = new Order();
        $order->status = 'unpaid';
        $order->total_price = $plan->price;
        $order->session_id = $session->id;
        $order->user_id = auth()->user()->id;
        $order->save();

        // $user = auth()->user();
        // $user->plan_id = $plan->id;
        // $user->save();

        return response()->json([
            'url' => $session->url
        ]);
    }

    public function success(Request $request)
    {

        $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
        $sessionId = $request->get('session_id');
        try {

            $session = $stripe->checkout->sessions->retrieve($sessionId);

            if (!$session) {
                throw new NotFoundHttpException();
            }

            $order = Order::where('session_id', $session->id)->first();
            if (!$order) {
                // $user = auth()->user();
                // $user->plan_id = null;
                // $user->save();

                throw new NotFoundHttpException();
            }
            if ($order->status === 'unpaid') {
                $order->status = 'paid';
                $order->save();

                // $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
                // $ends_at = $dateTime->modify('+1 month')->format('Y-m-d H:i:s');
                $user = User::find(Auth::id());
                if($user) {
                    $user->stripe_id = $session->customer; // cus_xxxx
                    // $user->ends_at = $ends_at;
                    $user->save();
                }
                // $user->stripe_id = "";
                // $user->ends_at = $ends_at;
                // $user->save();
            }

            $payment = new Payment();
            $payment->order_id = $order->id;
            $payment->st_cus_id = $session->customer;
            $payment->st_sub_id = $session->subscription;
            $payment->st_payment_intent_id = $session->payment_intent;
            $payment->st_payment_method = $session->payment_method_types[0];
            $payment->st_payment_status = $session->payment_status;
            $payment->date = $session->created;
            $payment->save();

            return redirect()->away(config('app.frontend_url').'/payment/success');
        } catch (\Exception $e) {
            throw new NotFoundHttpException();
        }
    }

    public function cancelOrder()
    {
        return redirect()->away(config('app.frontend_url').'/payment/cancellation');
    }

    public function Cancelsubscription()
    {
        // https://stripe.com/docs/billing/subscriptions/cancel?dashboard-or-api=api
        // \Stripe\Stripe::setApiKey('sk_test_09l3shTSTKHYCzzZZsiLl2vA');
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        // $subscription = \Stripe\Subscription::retrieve('sub_49ty4767H20z6a');
        // $subscription->cancel(); // 即時キャンセル

        $user = User::find(Auth::id());

        if(!$user) return;
        $st_cus_id = $user->stripe_id; // cus_xxxx
        if(!$st_cus_id) return;

        $payment = Payment::where('st_cus_id', $st_cus_id)
                    ->where('st_payment_status', 'paid')
                    ->orderBy('created_at', 'desc')
                    ->first();
        if(isset($payment->st_sub_id)) {
            \Stripe\Subscription::update(
                // 'sub_49ty4767H20z6a',
                $payment->st_sub_id
                [
                  'cancel_at_period_end' => true,
                ]
            );
        }
        // https://stripe.com/docs/billing/subscriptions/cancel?dashboard-or-api=api#events
        // 請求期間の終了時に (すなわち、cancel_at_period_end を true に設定することによって) サブスクリプションをキャンセルした場合、
        // customer.subscription.updated イベントが即時に起動されます。
        // このイベントは、サブスクリプションの cancel_at_period_end 値を反映します。
        // サブスクリプションが実際に期間の終了時にキャンセルされると、次に customer.subscription.deleted イベントが発生します。
    }

    // キャンセルされたサブスクリプションの再有効化
    // https://stripe.com/docs/billing/subscriptions/cancel?dashboard-or-api=api#reactivating-canceled-subscriptions
    public function reactivatingCanceledSubscriptions()
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $user = User::find(Auth::id());
        if(!$user) return;
        $st_cus_id = $user->stripe_id; // cus_xxxx
        if(!$st_cus_id) return;

        $payment = Payment::where('st_cus_id', $st_cus_id)
                    ->where('st_payment_status', 'paid')
                    ->orderBy('created_at', 'desc')
                    ->first();

        if(isset($payment->st_sub_id)) {
            $subscription = $stripe->subscriptions->retrieve($payment->st_sub_id);
            $stripe->subscriptions->update(
                $subscription->id,
                [
                    'cancel_at_period_end' => false,
                    'proration_behavior' => 'create_prorations',
                    'items' => [
                    [
                        'id' => $subscription->items->data[0]->id,
                        'price' => 'price_CBb6IXqvTLXp3f',
                    ],
                    ],
                ]
            );
        }
    }

    // app/Http/Middleware/VerifyCsrfToken.php でCSRFの設定済み
    // https://stripe.com/docs/webhooks/signatures?locale=ja-JP
    public function webhook(Request $request)
    {
        // return;

        // If you are testing your webhook locally with the Stripe CLI, you can find the
        // endpoint's secret by running `stripe listen`. Otherwise, find your
        // endpoint's secret in your webhook settings in the Developer Dashboard
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');
        // php://input は読み込み専用のストリームで、 リクエストの body 部から生のデータを読み込むことができます。
        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;
        
        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch(\UnexpectedValueException $e) {
            // Invalid payload
            return response('', 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response('', 400);
        }
        
        // Handle the event
        switch ($event->type) {
            case 'customer.created':
                $customer = $event->data->object;
                if($customer->email) {
                    $user = User::where('email', $customer->email)->first();

                    if($user->customer_id !== $customer->id){
                        $user->customer_id = $customer->id;
                        $user->save();
                    }
                }
                // return;
            // https://stripe.com/docs/payments/checkout/fulfill-orders?locale=ja-JP#create-event-handler
            case 'checkout.session.completed':
                $session = $event->data->object;
                $sessionId = $session->id;
                $order = Order::where('session_id', $sessionId)->first();
                if($order && $order->status === 'unpaid'){
                    $order->status = 'paid';
                    $order->save();
                    
                    $payment = new Payment();
                    $payment->order_id = $order->id;
                    $payment->st_cus_id = $session->customer; // cus_xxxxxx
                    $payment->st_sub_id = $session->subscription; // sub_xxxxxx
                    $payment->st_payment_intent_id = $session->payment_intent; // null
                    $payment->st_payment_method = $session->payment_method_types[0]; // card
                    $payment->st_payment_status = $session->payment_status; // paid
                    $payment->date = $session->created;
                    $payment->save();

                    // $dateTime = new DateTime(null, new DateTimeZone('Asia/Tokyo'));
                    // $ends_at = $dateTime->modify('+1 month')->format('Y-m-d H:i:s');
                    $email = $session->customer_details->email;
                   
                    // $user = User::find( $order->user_id );
                    // if($user) {
                    //     $user->stripe_id = $session->customer; // cus_xxxx
                    //     // $user->ends_at = $ends_at;
                    //     $user->save();
                    // }
                }


            // case 'payment_intent.succeeded':
            //     $paymentIntent = $event->data->object;
            // case 'subscription_schedule.canceled':
            //     $subscriptionSchedule = $event->data->object;
            //     error_log($payload);
            // case 'invoice.payment_succeeded': // Invoiceの支払いが成功したとき
            //     $invoice = $event->data->object;
            // case 'invoice.paid':
            //     $invoice = $event->data->object;
            //     $customer_email = $invoice->$customer_email;
            //     $user = User::where('email', $customer_email)->first();
            //     if(!$user) return;

            case 'customer.subscription.updated':
                $subscription = $event->data->object; // カスタマーがプランを変更したとき
                // $sub_id = $subscription->id; // sub_xxxx
                $stripe_id = $subscription->customer // cus_xxxx
                $user = User::where('stripe_id', $stripe_id)->first();
                if(!$user) return;

                $ends_at = $subscription->current_period_end;
                if( $user->ends_at !== $ends_at) {
                    $user->stripe_id = $session->customer;
                    $user->ends_at = $ends_at;
                }
                

            // case 'customer.subscription.deleted': // ユーザーのサブスクリプションを終了させたとき
            //         $subscription = $event->data->object;
            //         $stripe_id = $subscription->customer // cus_xxxx
            //         $user = User::where('stripe_id', $stripe_id)->first();
            //         if(!$user) return;
            //         $user->ends_at = null;
            // // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }
        
        // http_response_code(200);
        return response('');

    }

    // 'customer.subscription.created',
    // 'customer.subscription.updated',
    // 'customer.subscription.deleted',
    // 'customer.updated',
    // 'customer.deleted',
    // 'invoice.payment_action_required',
    // 'invoice.payment_succeeded',

    public function updateCustomer(Request $request)
    {
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

    }
}