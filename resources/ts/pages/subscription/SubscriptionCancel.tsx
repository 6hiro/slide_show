import { useNavigate } from "react-router-dom";



const SubscriptionCancel = () => {
    const navigate = useNavigate();

    return (
        <div 
            style={{
                // background: 'linear-gradient(45deg, #fa4e53, #fa4e53, #fff, #5cb5da, #5cb5da)',
                background: '#24292f',
                height: 'calc(100vh - 50px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{background: "#fff", padding: "15px 30px", borderRadius: "3px"}}>
                <p style={{margin: "0 0 25px", fontWeight: "600"}}>お支払いがキャンセルされました。</p>
                <button onClick={() => navigate('/settings')}
                    style={{
                        margin: "0px auto 0px auto", 
                        display: "block",
                        textAlign: "center",
                        width: "150px",
                        background: "#24292f",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 0 8px -5px rgb(0 0 0 / 47%)",
                        borderRadius: "5px",
                        padding: "8px",
                        fontSize: "14.5px",
                        cursor: "pointer"
                    }} 
                >
                    設定画面に戻る
                </button>

            </div>       
        </div>
    );
};

export default SubscriptionCancel;