<?php

namespace App\Http\Controllers\StripePayment;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    public function createPlan(Request $request)
    {
        if($request->user()->status !== "superuser") {
            return response()->json([
                'status' => false,
            ]);
        }
        if($request->pass !== env('ADMIN_PASS')) {
            // pass
            return response()->json([
                'status' => false,
            ]);
        }
        // name, price, interval, trial_period_days,

        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $plan = \Stripe\Price::create([
            // 'unit_amount' => $request->price * 100,
            'unit_amount' => $request->price,
            // 'currency' => 'usd',
            'currency' => 'jpy',
            // https://stripe.com/docs/api/prices/object#price_object-recurring
            'recurring' => [
                'interval' => $request->interval, // month || year || week || day
                'trial_period_days' => $request->trial_period_days,
            ],
            'lookup_key' => str()->snake($request->name),
            'transfer_lookup_key' => true,
            'product_data' => [
                'name' => $request->name,
            ],
        ]);

        $newPlan = new Plan();
        if ($plan && $plan->active === true) {
            $newPlan->st_plan_id = $plan->id;
            $newPlan->name = $request->name;
            $newPlan->price = $request->price;
            $newPlan->interval = $request->interval;
            $newPlan->trial_period_days = $request->trial_period_days;
            $newPlan->lookup_key = str()->snake($request->name);
            $newPlan->save();
        }

        return response()->json([
            'status' => true,
            'data' => $newPlan,
        ]);
    }

    public function getPlans()
    {
        $plans = Plan::all();
        return response()->json([
            'status' => true,
            'data' => $plans,
        ]);
    }
}