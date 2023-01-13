import React from 'react'
import axios from '../../libs/axios';
import { PLAN } from '../../types/plan'

const PlanCard = (props: {plan: PLAN, index: number}) => {
    const plan = props.plan;
    const colors = ['#9c27b0', '#ff9100', '#4615b2'];

    const handlePlan = async (planId: number) => {
        const res = await axios.post(`/checkout/${planId}`);

        if (res.status === 200) {
            window.location.replace(res.data.url);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div
                style={{
                    width: "360px",
                    background: '#e3f2fd',
                    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                    borderRadius: "10px",
                    padding: "4px",
                    textAlign: 'center',
                    height: 'auto',
                }}
            >
                <h2>{plan?.name}</h2>
                <p>Get the party started</p>
                <h2>{plan?.price}円</h2>
                <p>per {plan?.interval}</p>

                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. At, eos
                    deserunt? Sunt unde fugiat atque?
                </p>

                <button
                    style={{ background: colors[props.index], borderRadius: "10px", margin: "20px 0", padding: "10px 0" }}
                    onClick={() => handlePlan(plan?.id)}
                >
                    Get Started
                </button>
            </div>

        </div>
    )
}

export default PlanCard