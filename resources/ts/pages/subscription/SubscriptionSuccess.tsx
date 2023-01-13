import { useNavigate } from 'react-router-dom';

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    return (
        <div style={{justifyContent: "center", alignContent: "center", height: "clac(100vh - 110px)"}}>
            <h4 color='blue'>
                成功
            </h4>
            <p>
                We have received your payment. You can now access all the features in
                our app.
            </p>

            <button onClick={() => navigate('/settings')} style={{margin: "10px 0"}} >
                フェード
            </button>
        </div>
    );
};

export default SubscriptionSuccess;