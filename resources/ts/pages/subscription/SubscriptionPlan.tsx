import React, { useEffect, useState } from 'react'
import PlanCard from '../../components/subscription/PlanCard';
import axios from '../../libs/axios';
import { PLAN } from '../../types/plan'

const SubscriptionPlan = () => {
    const [plans, setPlans] = useState<PLAN[]>([]);

    useEffect(() => {
        const getData = async () => {
          const res = await axios.get('/plans');
          if (res.status === 200) setPlans(res.data.data);
        };
        getData();
      }, []);

    return (
        <div>
            {plans.map((plan, index) => (
                <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
        </div>
    )
}

export default SubscriptionPlan