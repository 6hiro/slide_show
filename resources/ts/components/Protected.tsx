import { Navigate, Outlet } from 'react-router-dom';

const Protected = () => {
    // const { user, error, isLoading } = useAuth();

    // if(isLoading) return null;

    // return (user) 
    //     ? <Outlet /> 
    //     : <NotAuthorized/>;
    return <Outlet /> 
};

const NotAuthorized = () => {
    return (
        <div style={{
            height:"100px", 
            display:"flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontWeight: "600",
            
        }}>
            <div>
                401 | ログインしてください
                <Navigate to="/" replace={true} />
            </div>
        </div>
    )
};


export default Protected;