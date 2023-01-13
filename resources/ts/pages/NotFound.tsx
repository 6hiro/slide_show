// import { Navigate } from "react-router-dom";

const NotFound = () => {
    return (
        <div style={{
            height:"100px", 
            display:"flex", 
            alignItems: "center", 
            justifyContent: "center",
            fontWeight: "600",
            
        }}>
            <div>
                404 | お探しのページは見つかりませんでした
                {/* <Navigate to="/" replace={true} /> */}
            </div>
        </div>
    )
};

export default NotFound;