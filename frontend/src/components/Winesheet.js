// State Management & Authentication
import {useAuth0} from "@auth0/auth0-react";
import {getConfig} from "../config/config";
import {useEffect, useState} from "react";

// Routing & Paths
import {Link, useParams} from "react-router-dom";
import axios from "axios";

// Style & Components
import './Winesheet.css';
import './AccessoryPage.css';
import './TextStyles.css'
import Loading from "./Loading";
import emptyHeartIcon from '../images/emptyFavorite.svg'
import heartIcon from '../images/favorite.svg'
import prevIcon from '../images/arrow_back.svg'
import nextIcon from '../images/arrow_forward.svg'

// Helper Functions
import {
    parseNeighbors,
    parseTechnicalData,
    parseOverview, parseFilePaths
} from "../utils/parseData";

// Component Description: Displays a single winesheet.
export default function Winesheet() {
    let params = useParams();
    const bottle_id = parseInt(params.winesheetId, 10);
    const [overview, setOverview] = useState(null);
    const [filePaths, setFilePaths] = useState(null);
    const [neighbors, setNeighbors] = useState(null);
    const [technicalData, setTechnicalData] = useState(null);
    const [error, setError] = useState(null);
    const {apiOrigin, audience, scope} = getConfig();
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [heart, setHeart] = useState(null);

    async function toggleFavorites() {
        if (isAuthenticated) {
            if (heart === false) {
                let token = await getAccessTokenSilently({audience, scope});
                try {
                    const addFavoriteResponse = await axios.post(`${apiOrigin}/user/favorites/wines/${bottle_id}`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setHeart(true);
                    console.log(JSON.stringify(addFavoriteResponse))

                } catch (favError) {
                    setError(favError)
                }
            } else {
                let token = await getAccessTokenSilently({audience, scope});
                try {
                    const removeFavoriteResponse = await axios.delete(`${apiOrigin}/user/favorites/wines/${bottle_id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    setHeart(false);
                    console.log(JSON.stringify(removeFavoriteResponse))
                } catch (favError) {
                    setError(favError)
                }
            }
        }
    }


// Fetch a specific bottle form the API.
    useEffect(() => {
        async function getBottle() {
            try {
                const res = await axios.get(`${apiOrigin}/techsheets/${bottle_id}`);
                setOverview(parseOverview(res.data));
                setFilePaths(parseFilePaths(res.data));
                setTechnicalData(parseTechnicalData(res.data));
                setNeighbors(parseNeighbors(res.data));

                if (isAuthenticated) {
                    /* Get JWT from Auth0 (ACCESS TOKEN) */
                    let token = await getAccessTokenSilently({audience, scope});

                    try {
                        /* If authenticated, check to see if the bottle is the user's favorite. */
                        const checkFavoritesStatus = await axios.get(`${apiOrigin}/user/favorites/wines/${bottle_id}`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            }
                        });

                        /* Set the state according to whether-or-not the user has favorited the wine.*/
                        setHeart(true)
                        console.log(JSON.stringify(checkFavoritesStatus))

                    } catch (err2) {

                        /* Error 404 indicates that the wine is not a favorite! */
                        if (err2.response.status === 404) {
                            setError(null)
                            setHeart(false)
                        } else {
                            /* Otherwise, we received a normal error. */
                            setError(err2)
                        }
                    }
                }
            } catch (err) {
                setError(err)
            }
        }

        getBottle();
    }, [apiOrigin, bottle_id, audience, getAccessTokenSilently, isAuthenticated, scope]);

    /* Print any error messages to the console.*/
    if (error) {
        console.log(error.message)
    }

    return <div className="winesheetPageContainer">
        <div className="winesheetPageCard">
            {overview && filePaths && technicalData && neighbors ? <>
                    <div className="winesheetPageCardItems">

                        {/* Navigation Arrow (Desktop) */}
                        <div className="navArrow">
                            <Link to={neighbors.prevSheetURL}><img
                                src={prevIcon} alt="Navigate to Previous Winesheet"/></Link>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="technicalData">
                            <div className="technicalDataHeader">
                                <span className="title">{overview.title}</span>
                                <span className="subtitle">{overview.subtitle}</span></div>

                            {/* Technical Data Grid */}
                            <div className="technicalDataGrid">
                                {technicalData.map((element) => <div className="technicalDataGridItem"
                                                                     key={element.property}>
                                    <span className="technicalDataGridProperty">{element.property}</span>
                                    <span className="technicalDataGridValue">{element.value}</span>
                                </div>)}
                            </div>
                        </div>

                        {/* Download Preview Section */}
                        <div className="downloadPreviewElements">
                            <div className="previewContainer">
                                {/* Navigation Arrows (Mobile Only) */}
                                <div className="mobile">
                                    <Link to={neighbors.prevSheetURL}><img
                                        src={prevIcon} alt="Navigate to Previous Winesheet"/></Link>
                                </div>
                                <div className="thumbnailContainer">


                                    {/* Favorite Button (Authenticated Only) */}
                                    {isAuthenticated && <>
                                        {heart ? <img src={heartIcon} className="favoriteButton" height="50px" width="50px"
                                                      alt="(SVGREPO CC0 License) Favorite a Wine"
                                                      onClick={() => toggleFavorites()}/> :
                                            <img src={emptyHeartIcon} className="favoriteButton" height="50px" width="50px"
                                                 alt="(SVGREPO CC0 License) Unfavorite a Wine"
                                                 onClick={() => toggleFavorites()}/>}
                                    </>
                                    }

                                    {/* Winesheet Preview Image */}
                                    <a href={filePaths.file} download>
                                        <img src={filePaths.thumbnail} className="winesheetPageThumbnail"
                                             alt="Winesheet Download Button"/>
                                    </a>
                                </div>
                                {/* Navigation Arrows (Mobile) */}
                                <div className="mobile">
                                    <Link to={neighbors.nextSheetURL}><img
                                        src={nextIcon} alt="Navigate to Previous Winesheet"/></Link>
                                </div>
                            </div>
                            {/* Download Button */}
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div className="downloadButton">
                                    <a href={filePaths.file} className="primaryButton darkPurple big" download>Download
                                        Techsheet</a>
                                </div>
                                {
                                    isAuthenticated && <div className="downloadButton">
                                        <a href={`/submit?bottle=${bottle_id}`} className="primaryButton darkPurple big">Edit
                                            Information</a>
                                    </div>
                                }

                            </div>

                        </div>
                        {/* Navigation Arrow (Desktop) */}
                        <div className="navArrow">
                            <Link to={neighbors.nextSheetURL}><img
                                src={nextIcon} alt="Navigate to Next Winesheet"/></Link>
                        </div>
                    </div>
                </>
                : <><Loading/></>}
        </div>
    </div>
}
