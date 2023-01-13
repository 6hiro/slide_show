import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BiEdit, BiKey, BiUserX, BiX } from 'react-icons/bi';
import { Helmet } from 'react-helmet';

import EditUserForm from '../../components/auth/EditUsernameForm';
import { useAuth } from '../../hooks/useAuth';
import useToggle from '../../hooks/useToggle';

import DeleteAccountForm from '../../components/auth/DeleteAccountForm';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import LoadingScreen from '../../components/layout/LoadingScreen';
import { siteTitle } from '../../constants/site';


type Props = {
    user: any;
    isLoading: boolean; 
    deleteAccount: Function;
    changeUserName: Function;
    changePassword: Function;
}
const Settings = (props: Props) => {
    const { user, isLoading, deleteAccount, changeUserName, changePassword } = props;
    let navigate = useNavigate();

    const [openEditForm, toggleEditForm] = useToggle(false);
    const [openPasswordForm, togglPasswordForm] = useToggle(false);
    const [openDeleteForm, togglDeleteForm] = useToggle(false);
    

    if (isLoading && !user) {
        return <div style={{ height:"100vh", display:"flex", alignItems: "center", justifyContent: "center" }}>
                <LoadingScreen/>
            </div>
    }

    if(!isLoading && !user?.id) return (<Navigate to="/" replace={true} />)

    return (

        <div className="settings">
            <Helmet>
                <meta charSet="utf-8" />
                <title>設定 / {siteTitle}</title>
                <meta
                    name="description"
                    content="設定"
                />
            </Helmet>

            {/* <div className="settings_title">
                <span className="setting_title_text">設定</span>
            </div> */}

            <p className="sub_title">
                <BiEdit />
                <span> アカウント名の変更</span>    
            </p>
        
            <div className="edit_account_button" >
                {openEditForm 
                    ? <div className="editForm" >
                            <div className="overlay" onClick={()=>toggleEditForm(false)}></div>
                            <div className="formContainer">
                                <div className="closeForm" onClick={()=>toggleEditForm(false)} ><BiX/></div>
                                <div className="form">
                                    <EditUserForm user={user} changeUserName={changeUserName} toggleEditForm={toggleEditForm} />
                                </div>
                            </div>
                        </div>
                    : null
                }
                <button className="open_modal_button" onClick={()=>toggleEditForm(true)}>アカウント名を変更する</button>
            </div>
                <p className="sub_title">
                <BiKey />
                <span> パスワードの変更</span>    
            </p>
            <div className="change_password_button">
                {openPasswordForm 
                    ? <div className="editForm" >
                            <div className="overlay" onClick={()=>togglPasswordForm(false)}></div>
                            <div className="formContainer">
                                <div className="closeForm" onClick={()=>togglPasswordForm(false)} ><BiX/></div>
                                <div className="form">
                                    <ChangePasswordForm user={user} changePassword={changePassword} togglPasswordForm={togglPasswordForm} />
                                </div>
                            </div>
                        </div>
                    : null
                }
                <button className="open_modal_button" onClick={ ()=> togglPasswordForm(true)}
                    >パスワードを変更する
                </button>
            </div>

            {/* # アカウントの削除 */}
            <p className="sub_title">
                <BiUserX />
                <span> アカウントの削除</span>    
            </p>
            <div
                className="delete_account_button"
                // onClick={handleClickOpen}
            >
                {openDeleteForm 
                    ? <div className="editForm" >
                            <div className="overlay delete_overlay" onClick={()=>togglDeleteForm(false)}></div>
                            <div className="formContainer">
                                <div className="closeForm" onClick={()=>togglDeleteForm(false)} ><BiX/></div>
                                <div className="form">
                                    <DeleteAccountForm 
                                        user={user} 
                                        toggle={()=>togglDeleteForm(false)} 
                                        deleteAccount={deleteAccount}
                                    />
                                </div>
                            </div>
                        </div>
                    : null
                }
                <button 
                    className="open_modal_button" 
                    onClick={()=>togglDeleteForm(true)}
                >アカウントを削除する
                </button>
            </div>

        </div>

    )
}

export default Settings;