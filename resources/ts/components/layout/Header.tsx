import { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiCog, BiHome, BiNotification, BiPencil, BiPlus, BiSearch, BiUser, BiX } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import NewVlideForm from '../vlide/drafts/NewVlideForm';
import { siteTitle } from '../../constants/site';

type HeaderProps = {
    isAuth: boolean;
    username: string;
    logout: () => Promise<void>;
    // nickName?: string;
};

const Header = memo( (props:HeaderProps) => {
    const navigate = useNavigate();
    const [on, toggle] = useToggle(false);
    const [onNewVlideForm, toggleNewVlideForm] = useToggle(false);

    return (
        <header className="header">
            <div className="header__nav">

                <div className="logo_wapper">
                    <div className="logo">
                        <img src='/images/Logo.png' width={28} height={28} />
                        <div>
                            <Link  to="/about"  className=""  key="about">
                                {siteTitle}
                            </Link>
                        </div>
                    </div>
                </div>


                <div className="links">
                    <Link  to="/"  className="link"  key="home">
                        {props.isAuth ? "フィード" : "ホーム"}
                    </Link>
                    <Link to="/search" className="link" key="search">
                        検索
                    </Link>

                    {props.isAuth 
                     ?  <>
                            <Link to="/settings" className="link" key="settings">
                                設定
                            </Link>
                            <Link to={`/prof/${props.username}`} className="link" key="account">
                            アカウント
                            </Link>
                        </>
                     :  <>
                            <Link to="/notifications" className="link" key="notifications">
                                お知らせ
                            </Link>
                            <Link to="/about" className="link" key="about">
                                {siteTitle}とは
                            </Link>
                        </>
                    }

                </div>

                <div className="auth_btns">
                    {props.isAuth 
                        ?<>
                            <div className="auth_btn" onClick={props.logout} >ログアウト</div>
                            <div 
                                className="auth_btn sign_up_btn"
                                onClick={() => {
                                    toggleNewVlideForm();
                                    toggle(false);
                                }} 
                            >
                                <BiPencil />
                                投稿
                            </div>
                        </> 
                        : <>
                            <div className="auth_btn" >
                                <Link to="/auth/login" >ログイン</Link>
                            </div>
                            <div className="auth_btn sign_up_btn" >
                                <Link  to="/auth/register">
                                    新規登録
                                </Link>
                            </div>
                        </>
                    }
                </div>
                
                <div className="menu_btn_wrapper">
                    <div
                        className={ `icon menu_btn ${on ? "active" : ""} `}
                        onClick={toggle}
                    >
                        <span className="border"></span>
                        <span className="border"></span>
                        <span className="border"></span>
                    </div>
                </div>
            </div>

            {/* New Vlide Form */}
            {(onNewVlideForm && !on) && 
                <div className="new_vlide_form_container" >
                    <div className="overlay" onClick={toggleNewVlideForm}></div>
                    <div className="form_container" >
                        <div className="close_form" onClick={toggleNewVlideForm} ><BiX/></div>
                        <div className="form_wrapper" >
                            <NewVlideForm 
                                toggleForm={toggleNewVlideForm}
                            />
                        </div>
                    </div>
                </div>
            }

            {/* MENUBAR */}
            {on &&
                <div className="menubar_wrapper">
                    <div className="menubar" >
                        <div className="links" >
                            <div className="link" 
                                onClick={ ()=>{
                                    toggle(false);
                                    navigate("/")
                                }}
                            >
                                {/* <Link to="/" key="home"> */}
                                <BiHome />
                                {props.isAuth ? "フィード" : "ホーム"}
                                {/* </Link> */}
                            </div>
                            <div 
                                className="link"
                                onClick={ () => {
                                    toggle(false);
                                    navigate("/search")
                                }}
                            >
                                {/* <Link to="/search" key="search" > */}
                                    <BiSearch />
                                    検索
                                {/* </Link> */}
                            </div>

                            {props.isAuth 
                                ?  <>
                                        <div 
                                            className="link" 
                                            onClick={ () => {
                                                toggle(false);
                                                navigate(`/prof/${props.username}`)
                                                // to={`/prof/${props.username}`}
                                            }}
                                        >
                                            {/* <Link to="/account" key="account" > */}
                                            <BiUser />
                                            アカウント
                                            {/* {props.nickName} */}
                                            {/* </Link> */}
                                        </div>
                                        <div 
                                            className="link" 
                                            onClick={ () => {
                                                toggle(false);
                                                navigate("/settings")
                                            }}
                                        >
                                            {/* <Link to="/settings" key="settings" > */}
                                            <BiCog />
                                                設定
                                            {/* </Link> */}
                                        </div>

                                    </>
                                :
                                    <>
                                        <div 
                                            className="link" 
                                            onClick={ () => {
                                                toggle(false);
                                                navigate("/notifications")
                                            }}
                                        >
                                            {/* <Link to="/notifications" key="notifications" > */}
                                            <BiNotification />
                                            お知らせ
                                            {/* </Link> */}
                                        </div>
                                        <div 
                                            className="link"
                                            onClick={ () => {
                                                toggle(false);
                                                navigate("/about")
                                            }}
                                        >
                                            <img src='/images/Logo.png' width={24} height={24} />
                                            {/* <BiBulb /> */}
                                            {/* <Link to="/about" key="about" > */}
                                                {siteTitle}とは
                                            {/* </Link> */}
                                        </div>
                                    </>
                            }

                            {props.isAuth 
                                ?   <>
                                        <div
                                            className="link"
                                            onClick={ () => {
                                                toggleNewVlideForm();
                                                toggle(false);
                                            }} 
                                        >
                                            <BiPlus />投稿
                                        </div>
                                        <div className="link logout_btn" onClick={props.logout} >ログアウト</div>

                                    </>

                                :   <>
                                        <div 
                                            className="link login_btn" 
                                            onClick={ () => {
                                                toggle(false);
                                                navigate("/auth/login")
                                            }}
                                        >
                                            {/* <Link to="/auth/login" > */}
                                                ログイン
                                            {/* </Link> */}
                                        </div>

                                        <div 
                                            className="link sign_up_btn" 
                                            onClick={ () => {
                                                toggle(false);
                                                navigate("/auth/register")
                                            }}
                                        >
                                            {/* <Link to="/auth/register"> */}
                                                新規登録
                                            {/* </Link> */}
                                        </div>
                                    </>
                            }
                        </div> 
                    </div>
                </div>
            }
        </header>
    );
});

export default Header;