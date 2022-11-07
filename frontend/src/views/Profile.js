// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";

// Routing & Paths
import {Navigate} from "react-router-dom";

// Style & Components
import UserData from "../components/UserData";


// Component Description: The "User Profile" page.
export default function Profile() {
    const {isAuthenticated} = useAuth0();
    return <>
        {isAuthenticated ? <UserData/> : <Navigate to="/"/>}
    </>
}