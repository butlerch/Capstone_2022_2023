// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";

// Routing & Paths
import {Navigate} from "react-router-dom";
import Tabs from "../components/Tabs";

// Style & Components


// Component Description: The "User Profile" page.
export default function Profile() {
    const {isAuthenticated} = useAuth0();
    return <>
        {isAuthenticated ? <Tabs /> : <Navigate to="/" />}
    </>
}
