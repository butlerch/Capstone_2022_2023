// State Management & Authentication
//-none-

// Routing & Paths
import {Link} from "react-router-dom";

// Style & Components
import './NavBottom.css';
import {useAuth0} from "@auth0/auth0-react";


// Component Description: The bottom-most/footer navigation bar.
function NavBottom() {
    const {isAuthenticated} = useAuth0();

    return <div className="navBottomBar">
        <div className="bottomBarElements">

            {/* {isAuthenticated && <Link to="/admin" className="bottomBarText">Admin</Link>} */}
        </div>

        <div className="bottomBarElements">
            <Link to="/about" className="bottomBarText">About</Link>
            <span className="seperator">|</span>
            <Link to="/contact" className="bottomBarText">Contact</Link>
            <span className="seperator">|</span>
            <Link to="/developer" className="bottomBarText">Developer</Link>
            <span className="seperator">|</span>
            <Link to="/howtousethissite" className="bottomBarText">How to Use This Site</Link>
        </div>
    </div>
}

export default NavBottom;
