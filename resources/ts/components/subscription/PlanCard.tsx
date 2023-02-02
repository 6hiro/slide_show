// import React from 'react';
import axios from '../../libs/axios';
import { PLAN } from '../../types/plan'
import { ACCOUNT } from '../../types/user';

const PlanCard = (props: {user: ACCOUNT, plan: PLAN, index: number}) => {
    const plan = props.plan;
    const colors = ['#333', '#5cb5da', '#fa4e53'];

    const handleStartPlan = async (planId: number) => {
        const res = await axios.post(`api/payment/checkout/${planId}`);

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
                // height: '100vh',
            }}
        >
            <div
                style={{
                    width: "320px",
                    background: "#fff",
                    // boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                    boxShadow: "0 0 8px -5px rgb(0 0 0 / 47%)",
                    borderRadius: "10px",
                    padding: "4px",
                    textAlign: 'center',
                    height: 'auto',
                }}
            >
                <h2 style={{margin: "20px 0 10px", fontSize: "20px", color: "#444"}}>{plan?.name === 'Basic' && "標準プラン"}</h2>
                <h2 style={{margin: "0 0 20px 0", fontSize: "27px", color: "#222"}}>{Math.floor(plan?.price)} 円 
                    <span style={{fontWeight: "normal"}}>
                        {plan?.interval === 'month' && " / 月"}
                    </span>
                </h2>

                {plan?.name === 'Basic' 
                    ? 
                        <div style={{margin: "20px auto 25px", width: "240px", color: "#333", fontSize: "15.5px", textAlign: "left", display: "flex", flexDirection: "column", rowGap: "10px"}}>
                            <p><span style={{color: "#222", paddingRight: "10px"}}>✔︎</span>投稿： 40 件 / 月</p>
                            <p><span style={{color: "#222", paddingRight: "10px"}}>✔︎</span>画像： 30 枚 / 1 投稿</p>
                            <p><span style={{color: "#222", paddingRight: "10px"}}>✔︎</span>クリップ： 400 件 / 月</p>
                            <p><span style={{color: "#222", paddingRight: "10px"}}>✔︎</span>ブック： 20 件</p>
                            <p><span style={{color: "#222", paddingRight: "10px"}}>✔︎</span>チケット： 150 枚 / 1 ブック</p>
                        </div>
                    :null
                }
                <p style={{margin: "10px 0 15px", fontSize: "15px", color: "#fa4e53", textAlign: "center"}}>※ 返金対応は行っておりません。</p>

                <button
                    style={{ 
                        background: colors[props.index], 
                        borderRadius: "10px", 
                        margin: "5px 0 25px", 
                        padding: "8px 0",
                        outline: "none", 
                        border: "1px solid #ddd", 
                        width: "220px",
                        cursor: "pointer",
                        color: "#fff",
                        fontSize: "16px",
                        fontWeight: "600px"
                    }}
                    onClick={() => {
                        if(props.user.plan !== "Basic"){
                            handleStartPlan(plan?.id);
                        }  
                    }}
                >
                    {/* { props.user.plan !== "Basic" ? "プランを解約" : "はじめる"} */}
                    { props.user.plan === "Basic" ? "プランを解約" : "はじめる"}
                    
                </button>
            </div>

        </div>
    )
}

export default PlanCard