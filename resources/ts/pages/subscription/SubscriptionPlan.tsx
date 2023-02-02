import React, { useEffect, useState } from 'react';

import PlanCard from '../../components/subscription/PlanCard';
import axios from '../../libs/axios';
import { PLAN } from '../../types/plan'
import { ACCOUNT } from '../../types/user';

type Props = {
    user: ACCOUNT;
};
const SubscriptionPlan = (props: Props) => {
    const [plans, setPlans] = useState<PLAN[]>([]);

    useEffect(() => {
        const getData = async () => {
          const res = await axios.get('/api/payment/plans');
          if (res.status === 200) setPlans(res.data.data);
        };
        getData();
      }, []);

    return (
        <div
            style={{
                height: 'calc(100vh - 50px)',
                padding: "20px",
                background: 'linear-gradient(45deg, #fa4e53, #fa4e53, #fff, #5cb5da, #5cb5da)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // height: '400px',
                    padding: "20px",
                }}
            >
                <h1 style={{margin: "20px 0 15px", fontSize: "28px", color: "#000", textAlign: "center"}}>料金</h1>
                {plans?.map((plan, index) => (
                    <PlanCard key={plan.id} plan={plan} index={index} user={props.user} />
                ))}
            </div>
        </div>
    )
}

export default SubscriptionPlan