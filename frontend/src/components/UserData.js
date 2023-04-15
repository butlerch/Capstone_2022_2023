// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config/config";
import {useEffect, useState} from "react";

// Routing & Paths
import axios from "axios";

// Style & Components
import AccessoryPage from "./AccessoryPage";
import {parseOverview} from "../utils/parseData";
import {useNavigate} from "react-router-dom";
import "./Buttons.css";
import favoriteIcon from "../images/favorite.svg";
import {reqFavite, reqQualities} from "../api";

// Component Description: Display's the user's data, including their favorite techsheets.
export default function UserData() {
    const {user, getAccessTokenSilently, getIdTokenClaims} = useAuth0();
    const [error, setError] = useState(null);
    const {apiOrigin, audience, scope} = getConfig();
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const [fav_wineries, setFav_wineries] = useState([]);
    const [fav_qualities, setFav_qualities] = useState([]);
    const user_id = localStorage.getItem("user_id");
    const getFavorites = async () => {
        let res = await reqFavite({userId: user_id});
        let res2 = await reqQualities({userId: user_id});
        setFav_wineries(res);
        let data = [];
        for (let key in res2) {
            data.push([key, res2[key]]);
        }
        setFav_qualities(data);
    };

    useEffect(() => {
        async function getUser() {
            /* Get JWT from Auth0 (ACCESS TOKEN) */
            const token = await getAccessTokenSilently({audience, scope});

            try {
                /* GET User */
                const res = await axios.get(`${apiOrigin}/user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(res, "userdata");
                setUserData(res.data);
            } catch (err) {
                /* Display the error. */
                setError(err.message);
                console.log(err.message);
            }
        }

        getUser();
        getFavorites();
    }, [
        apiOrigin,
        audience,
        getAccessTokenSilently,
        getIdTokenClaims,
        scope,
        user,
    ]);

    return (
        <AccessoryPage title={"hello, " + user.nickname} subtitle={"USER PROFILE"}>
            {/* Seperator Bar */}
            <div className="separator">
                <p>
                    <hr className="separatorBar" />
                </p>
            </div>
            <div>
                <blockquote>
                    {error && <>{JSON.stringify(error)}</>}
                    {!userData ? (
                        <>Loading...</>
                    ) : (
                        <>
                            <div className="heading headingContainer extraCushion">
                                <img
                                    className="sideSpace"
                                    src={favoriteIcon}
                                    width="25px"
                                    height="25px"
                                    alt="My Favorite Techsheets"
                                />
                                <b>My Favorite Techsheets</b>
                            </div>
                            <div className="primaryButtonContainer">
                                {userData &&
                                userData["fav_techsheets"] &&
                                userData["fav_techsheets"].length > 0 ? (
                                    userData["fav_techsheets"].map((element) => (
                                        <>
                                            <button
                                                id={element}
                                                key={element}
                                                className="primaryButton narrow mediumPurple"
                                                onClick={() =>
                                                    navigate("/winesheets/" + element["bottle_id"])
                                                }
                                            >
                                                {parseOverview(element).title !== undefined &&
                                                    parseOverview(element).title}{" "}
                                                {parseOverview(element).subtitle !== undefined &&
                                                    parseOverview(element).subtitle}
                                            </button>
                                        </>
                                    ))
                                ) : (
                                    <>You don't have any favorite techsheets.</>
                                )}
                            </div>
                        </>
                    )}
                    {!userData ? (
                        <>Loading...</>
                    ) : (
                        <>
                            <div className="heading headingContainer extraCushion">
                                <img
                                    className="sideSpace"
                                    src={favoriteIcon}
                                    width="25px"
                                    height="25px"
                                    alt="My Favorite Techsheets"
                                />
                                <b>My Favorite Wineries</b>
                            </div>
                            <div className="primaryButtonContainer">
                                {userData &&
                                fav_wineries.length > 0 ? (
                                    fav_wineries.map((element) => (
                                        <>
                                            <button
                                                id={element}
                                                key={element}
                                                className="primaryButton narrow mediumPurple"
                                                // Will need to change navigate to the winery page once we have those coded

                                            >
                                                {element}
                                            </button>
                                        </>
                                    ))
                                ) : (
                                    <>You don't have any favorite wineries.</>
                                )}
                            </div>
                        </>
                    )}
                    {!userData ? (
                        <>Loading...</>
                    ) : (
                        <>
                            <div className="heading headingContainer extraCushion">
                                <img
                                    className="sideSpace"
                                    src={favoriteIcon}
                                    width="25px"
                                    height="25px"
                                    alt="My Favorite Qualities"
                                />
                                <b>My Favorite Qualities</b>
                            </div>
                            <div className="primaryButtonContainer">
                                {userData &&
                                fav_qualities.length > 0 ? (
                                    fav_qualities.map((element) => (
                                        <>
                                            <button
                                                id={element}
                                                key={element}
                                                className="primaryButton narrow mediumPurple"
                                                // Will need to change navigate to the winery page once we have those coded
                                            >
                                                {element[0] + '：' + element[1]}
                                            </button>
                                        </>
                                    ))
                                ) : (
                                    <>You don't have any favorite qualities.</>
                                )}
                            </div>
                        </>
                    )}
                </blockquote>
            </div>
        </AccessoryPage>
    );
}
