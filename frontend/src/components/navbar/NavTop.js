// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";

// Routing & Paths
import {Link} from "react-router-dom";

// Style & Components
import wineLogo from '../../images/wine_lake_logo.svg'
import userIcon from '../../images/user.svg'
import logoutIcon from '../../images/logout.svg'
import loginIcon from '../../images/login.svg'
import "../Buttons.css";
import './NavTop.css';

export default function NavTop() {
    const {loginWithRedirect, isAuthenticated, logout, user} = useAuth0();

    return <div className="topBar">
        <div className="topBarContentContainer">
            {/* Logo */}
            <div className="logoContainer">
                <Link to="/">
                    <img src={wineLogo} className="iconButton" id="logo" alt="The Wine Logo"/>
                </Link>
            </div>

            {/* Menu */}
            <div className="menuContainer">
                {isAuthenticated ? <>
                        {/* Desktop Menu Elements (Authenticated) */}
                        <div className="desktop">
                            <div className="menuItem">
                                <Link to="/profile" className="menuItem menuText">
                                    <img src={userIcon} className="iconButton" width="25px" height="25px" alt="User Icon"/>
                                    {user.name}
                                </Link>
                            </div>
                            <div className="menuSpacer"/>
                            <div className="menuItem">
                                <button className="textButton menuText desktop"
                                        onClick={() => logout({returnTo: window.location.origin})}>Log Out
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Elements (Authenticated) */}
                        <div className="mobile">
                            <div className="menuItem">
                                <Link to="/profile"> <img src={userIcon} width="25px" height="25px"
                                                          className="iconButton mobile"
                                                          alt="User Icon"/></Link>
                            </div>
                            <div className="menuItem">
                                <img src={logoutIcon} width="25px" height="25px" className="iconButton mobile"
                                     onClick={() => logout({returnTo: window.location.origin})} alt="User Icon"/>
                            </div>
                        </div>
                    </>
                    :
                    <>{/* Desktop Menu Elements (Unauthenticated) */}
                        <div className="desktop">
                            <div className="menuItem">
                                <button className="textButton menuText desktop" onClick={() => loginWithRedirect()}>Log
                                    In
                                </button>
                                <div className="menuSpacer"/>
                            </div>
                            <div className="menuItem">
                                <button className="textButton menuText desktop"
                                        onClick={() => loginWithRedirect({screen_hint: 'signup'})}>Sign Up
                                </button>

                            </div>
                        </div>

                        {/* Mobile Menu Elements (Unauthenticated) */}
                        <div className="mobile">
                            <div className="menuItem">
                                <img src={loginIcon} width="25px" height="25px" className="iconButton mobile"
                                     onClick={() => loginWithRedirect()} alt="Login Button"/>
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    </div>
}
