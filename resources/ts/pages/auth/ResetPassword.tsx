import { Navigate } from 'react-router-dom';
import ResetPasswordCard from '../../components/auth/ResetPasswordCard';



type Props = {
    user: any, 
    resetPassword: Function,
};

const ResetPassword = (props: Props) => {
    const {user, resetPassword} = props;

    if(user?.id) return (<Navigate to="/" replace={true} />)
  
    return (
        <div className='auth_page_container'>
            <ResetPasswordCard resetPassword={resetPassword} />
        </div>
    )
};

export default ResetPassword;