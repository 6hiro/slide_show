// https://stripe.com/docs/stripe-js/react?locale=ja-JP
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import {PaymentElement} from '@stripe/react-stripe-js';

// import { stripeAPIToken } from '../../constants/site';

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(stripeAPIToken);

// export default function Subscription() {
//     const options = {
//         // passing the client secret obtained from the server
//         clientSecret: '{{CLIENT_SECRET}}',
//     };

//     return (
//         <Elements stripe={stripePromise} options={options}>
//             <CheckoutForm />
//         </Elements>
//     );
// };


// const CheckoutForm = () => {
//     return (
//         <form>
//             <PaymentElement />
//             <button>Submit</button>
//         </form>
//     );
// };

// export default CheckoutForm;



