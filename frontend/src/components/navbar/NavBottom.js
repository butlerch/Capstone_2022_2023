// State Management & Authentication
//-none-

// Routing & Paths
import {Link} from "react-router-dom";

// Style & Components
import './NavBottom.css';
import {useAuth0} from "@auth0/auth0-react";


// Component Description: The bottom-most/footer navigation bar.
function NavBottom() {
    const {loginWithRedirect, isAuthenticated, logout, user} = useAuth0();

    return <div className="navBottomBar">
        <div className="bottomBarElements">

            {isAuthenticated && <Link to="/submit" className="bottomBarText">Submit</Link>}
        </div>

        <div className="bottomBarElements">
            <Link to="/about" className="bottomBarText">About</Link>
            <span className="seperator">|</span>
            <Link to="/contact" className="bottomBarText">Contact</Link>
            <span className="seperator">|</span>
            <Link to="/developer" className="bottomBarText">Developer</Link>
        </div>
    </div>
}

export default NavBottom;
