// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config/config";
import {useEffect, useState} from "react";

// Routing & Paths
import axios from 'axios';

// Style & Components
import AccessoryPage from "./AccessoryPage";
import {parseOverview} from "../utils/parseData";
import {useNavigate} from 'react-router-dom';
import './Buttons.css';
import favoriteIcon from '../images/favorite.svg'


// Component Description: Display's the user's data, including their favorite techsheets.
export default function UserData() {
    const {user, getAccessTokenSilently, getIdTokenClaims} = useAuth0();
    const [error, setError] = useState(null);
    const {apiOrigin, audience, scope} = getConfig();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        async function getUser() {
            /* Get JWT from Auth0 (ACCESS TOKEN) */
            const token = await getAccessTokenSilently({audience, scope});

            try {
                /* GET User */
                const res = await axios.get(`${apiOrigin}/user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setUserData(res.data)
            } catch (err) {
                /* Display the error. */
                setError(err.message)
                console.log(err.message)
            }
        }

        getUser();
    }, [apiOrigin, audience, getAccessTokenSilently, getIdTokenClaims, scope, user]);

    return <AccessoryPage title={"hello, " + user.nickname} subtitle={"USER PROFILE"}>
        {/* Seperator Bar */}
        <div className="separator">
            <p>
                <hr className="separatorBar"/>
            </p>
        </div>
        <div>
            <blockquote>
                {error && <>{JSON.stringify(error)}</>}
                {!userData ? <>Loading...</> : <>
                    <div className="heading headingContainer extraCushion"><img className="sideSpace" src={favoriteIcon}
                                                                                width="25px" height="25px"
                                                                                alt="My Favorite Techsheets"/><b>My
                        Favorite Techsheets</b></div>
                    <div className="primaryButtonContainer">
                        {userData && userData["fav_techsheets"] && userData["fav_techsheets"].length > 0 ? userData["fav_techsheets"].map((element) =>
                            <>
                                <button id={element} key={element} className="primaryButton narrow mediumPurple"
                                        onClick={() => navigate('/winesheets/' + element["bottle_id"])}>{parseOverview(element).title !== undefined && parseOverview(element).title} {parseOverview(element).subtitle !== undefined && parseOverview(element).subtitle}</button>
                            </>) : <>You
                            don't have any favorite techsheets.</>}
                    </div>
                </>}
                {!userData ? <>Loading...</> : <>
                    <div className="heading headingContainer extraCushion"><img className="sideSpace" src={favoriteIcon}
                                                                                width="25px" height="25px"
                                                                                alt="My Favorite Techsheets"/><b>My
                        Favorite Wineries</b></div>
                    <div className="primaryButtonContainer">
                        {userData && userData["fav_wineries"] && userData["fav_wineries"].length > 0 ? userData["fav_wineries"].map((element) =>
                            <>
                                <button id={element} key={element} className="primaryButton narrow mediumPurple"
                                    // Will need to change navigate to the winery page once we have those coded
                                        onClick={() => navigate('/')}>{element["winery_name"]}</button>
                            </>) : <>You
                            don't have any favorite wineries.</>}
                    </div>
                </>}
            </blockquote>
        </div>
    </AccessoryPage>

}
