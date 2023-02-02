import React, { useEffect, useState } from 'react'
import PlanCard from '../../components/subscription/PlanCard';
import axios from '../../libs/axios';
import { PLAN } from '../../types/plan';
import { ACCOUNT } from '../../types/user';

type Props = {
    user: ACCOUNT;
};
const Plan = (props: Props) => {
    // name, price, interval, trial_period_days
    // ADMIN_PASS
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [pass, setPass] = useState("");

    const submit = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
      
        if(props.user.status === "superuser") {
            const url = "/api/payment/plan";

            await axios
            .post(url, {
                name: name,
                price: price,
                interval: 'month',
                trial_period_days: 0,
                pass: pass,
            })
        }
    }

    // const [plans, setPlans] = useState<PLAN[]>([]);

    // useEffect(() => {
    //     const getData = async () => {
    //       const res = await axios.get('/api/payment/plans');
    //       if (res.status === 200) setPlans(res.data.data);
    //     };
    //     getData();
    //   }, []);

    if(props.user.status !== "superuser") return null;

    return (
        <div style={{textAlign: "center"}}>
            <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder='NAME' 
                required 
                autoFocus={false} 
                style={{margin: "20px"}}
                // maxLength={maxLength}
            />

            <br />
            <input
                type="text" 
                value={pass}
                onChange={e => setPass(e.target.value)}
                placeholder='PASS' 
                required 
                autoFocus={false} 
                style={{margin: "20px"}}
                // maxLength={maxLength}
            />
            <br />
                        
            <input
                type="number" 
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder='PRICE' 
                required 
                autoFocus={false} 
                // maxLength={maxLength}
                style={{margin: "20px"}}
            />

            <br />
            <button 
                className='' 
                style={{background: "#333", color: "#efefef", padding: "5px 10px"}} 
                onClick={(e)=>{submit(e)}}
            >SUBMIT</button>

            {/* <div className="" style={{marginTop: "20px"}}>
                {plans?.map((plan, index) => (
                    <PlanCard key={plan.id} plan={plan} index={index} />
                ))}
            </div> */}
        </div>
    )
};

export default Plan;