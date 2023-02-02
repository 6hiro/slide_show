import { memo } from 'react';
import { Link } from 'react-router-dom';
import { BiCog, BiHome, BiNotification, BiPlus, BiSearch, BiUser, BiX } from 'react-icons/bi';

import useToggle from '../../hooks/useToggle';
import NewVlideForm from '../vlide/drafts/NewVlideForm';
import { siteTitle } from '../../constants/site';
import NewClipForm from '../clip/NewClipForm';
import NewBookForm from '../book/NewBookForm';

type HeaderProps = {
    isAuth: boolean;
    username: string;
    logout: () => Promise<void>;
    // nickName?: string;
};

const Header = memo( (props:HeaderProps) => {
    // const navigate = useNavigate();
    const [on, toggle] = useToggle(false);
    const [onNewVlideForm, toggleNewVlideForm] = useToggle(false);
    const [onNewClipForm, toggleNewClipForm] = useToggle(false);
    const [onNewContentMenu, toggleNewContentMenu] = useToggle(false);
    const [onNewBookForm, toggleNewBookForm] = useToggle(false);

    return (
        <header className="header">
            <div className="header__nav">
                <div className="logo_wapper">
                    <div className="logo">
                        {/* <div className="logo_img_container">
                            <img src='/images/Logo.png' width={28} height={28} alt="vlides_logo" />
                            <div className="img_cover"></div>
                        </div> */}

                        <div>
                            <Link  to="/"  className=""  key="about">
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
                            <Link to={`/prof/${props.username}`} className="link" key="account">
                            アカウント
                            </Link>
                            <Link to="/settings" className="link" key="settings">
                                設定
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
                                    toggleNewVlideForm(true);
                                    toggleNewClipForm(false)
                                    toggleNewBookForm(false)
                                    toggleNewContentMenu(true);
                                    toggle(false);
                                }} 
                            >
                                作成
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

            {(onNewContentMenu && !on) && 
                <div className="new_content_form_container" >
                    <div className="overlay" onClick={toggleNewContentMenu}></div>
                    <div className="form_container" >
                        <div className="close_form" onClick={toggleNewContentMenu} ><BiX/></div>
                        <div className="form_wrapper" >
                            <div className='navigation'>
                                <div
                                    className={`nav_item ${onNewVlideForm ? "active_nav_item" : ""}`}
                                    onClick={ () => {
                                        toggleNewBookForm(false);
                                        toggleNewVlideForm(true);
                                        toggleNewClipForm(false)
                                    }}
                                >投稿</div>
                                <div
                                    className={`nav_item ${onNewClipForm ? "active_nav_item" : ""}`}
                                    onClick={ () => {
                                        toggleNewBookForm(false);
                                        toggleNewVlideForm(false);
                                        toggleNewClipForm(true)
                                    }}
                                >クリップ</div>
                                <div 
                                    className={`nav_item ${onNewBookForm ? "active_nav_item" : ""}`}
                                    onClick={ () => {
                                        toggleNewBookForm(true);
                                        toggleNewVlideForm(false);
                                        toggleNewClipForm(false)
                                    }}
                                >ブック</div>
                            </div>

                            {onNewVlideForm &&
                                <NewVlideForm 
                                    toggleForm={toggleNewContentMenu}
                                />
                            }
                            {onNewClipForm && 
                                <NewClipForm 
                                    toggleForm={toggleNewContentMenu}
                                />
                            }
                            {onNewBookForm && <NewBookForm toggleForm={toggleNewContentMenu} />}
                        </div>
                    </div>
                </div>
            }

            {/* New Vlide Form */}
            {/* {(onNewVlideForm && !on && !onNewContentMenu) && 
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
            } */}

            {/* MENUBAR */}
            {on &&
                <div className="menubar_wrapper">
                    <div className="menuba_overlay" onClick={()=>toggle(false)}></div>
                    
                    <div className="menubar" >
                        <div className="links" >
                            <div
                                className="link"
                                onClick={() => { toggle(false);}}
                            >
                                <Link to="/" key="home" style={{ width: "100%"}}>
                                    <BiHome />
                                    {props.isAuth ? "フィード" : "ホーム"}
                                </Link>
                            </div>
                            <div 
                                className="link"
                                onClick={() => { toggle(false);}}
                            >
                                <Link to="/search" key="search" style={{ width: "100%"}}>
                                    <BiSearch />
                                    検索
                                </Link>
                            </div>

                            {props.isAuth 
                                ?  <>
                                        <div className="link" onClick={() => {toggle(false);}}>
                                            <Link to={`/prof/${props.username}`} key="prof" style={{ width: "100%"}}>
                                                <BiUser />
                                                アカウント
                                            </Link>
                                        </div>
                                        <div className="link" onClick={() => { toggle(false);}} >
                                            <Link to="/settings" key="settings" style={{width: "100%"}}>
                                                <BiCog />
                                                設定
                                            </Link>
                                        </div>

                                    </>
                                :
                                    <>
                                        <div className="link" onClick={() => {toggle(false);}}>
                                            <Link to="/notifications" key="notifications" style={{width: "100%"}}>
                                                <BiNotification />
                                                お知らせ
                                            </Link>
                                        </div>
                                        <div className="link" onClick={() => {toggle(false);}}>
                                            <Link to="/about" key="about" style={{width: "100%"}}>
                                                <img src='/images/Logo.png' width={27} height={27} alt="vlides_logo" />
                                                {siteTitle}とは
                                            </Link>
                                        </div>
                                    </>
                            }

                            {props.isAuth 
                                ?   <>
                                        <div
                                            className="link"
                                            onClick={() => {
                                                toggleNewVlideForm(true);
                                                toggleNewClipForm(false)
                                                toggleNewBookForm(false)
                                                toggleNewContentMenu(true);
                                                toggle(false);
                                            }} 
                                        >
                                            <BiPlus />作成
                                        </div>
                                        <div className="link logout_btn" onClick={props.logout} >ログアウト</div>

                                    </>

                                :   <>
                                        <div className="link login_btn" onClick={ () => { toggle(false);}}>

                                            <Link to="/auth/login" style={{width: "100%", display: "block"}}>
                                                ログイン
                                            </Link>
                                        </div>

                                        <div className="link sign_up_btn" onClick={ () => { toggle(false);}}>
                                            <Link to="/auth/register" style={{width: "100%", display: "block"}}>
                                                新規登録
                                            </Link>
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