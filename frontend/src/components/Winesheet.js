// State Management & Authentication
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../config/config";
import { useEffect, useState } from "react";
// start
import { Alert, Button, Dialog, Snackbar, TextField } from "@mui/material";
// end
// Routing & Paths
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Style & Components
import "./Winesheet.css";
import "./AccessoryPage.css";
import "./TextStyles.css";
import Loading from "./Loading";
import emptyHeartIcon from "../images/emptyFavorite.svg";
import heartIcon from "../images/favorite.svg";
import prevIcon from "../images/arrow_back.svg";
import nextIcon from "../images/arrow_forward.svg";
import {
  reqFavite,
  addOrDelFavite,
  addOrDelQualities,
  reqQualities,
} from "../api";

// Helper Functions
import {
  parseFilePaths,
  parseNeighbors,
  parseOverview,
  parseTechnicalData,
} from "../utils/parseData";
import { string } from "prop-types";
import { color } from "echarts";

// Component Description: Displays a single winesheet.
export default function Winesheet() {
  let params = useParams();
  const bottle_id = parseInt(params.winesheetId, 10);
  const [overview, setOverview] = useState(null);
  const [filePaths, setFilePaths] = useState(null);
  const [neighbors, setNeighbors] = useState(null);
  const [technicalData, setTechnicalData] = useState(null);
  const [error, setError] = useState(null);
  const { apiOrigin, audience, scope } = getConfig();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [heart, setHeart] = useState(null);
  const [wineryHeart, setWineryHeart] = useState(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  // start
  const [favorites, setFavorites] = useState();
  const [mesType, setMsgType] = useState("success");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const vertical = "top";
  const horizontal = "center";
  const getFavorites = async () => {
    let res = await reqFavite({ userId: user_id });
    let res2 = await reqQualities({ userId: user_id });
    setFavorites(res);
    let data = [];
    res.forEach((values) => {
      if (data === null) {
        console.log("222");
        data = ["winery_name" + values];
      } else if (data.includes("winery_name" + values)) {
        console.log("333");
        data = data.filter((item) => item !== "winery_name" + values);
      } else {
        console.log("444");
        data.push("winery_name" + values);
      }
    });
    
    for (let key in res2) {
      console.log('value',(res2[key]+'').trim());
      let myvalue = (res2[key]+'').trim();
      if (data === null) {
        console.log("222");
        data = [key + myvalue];
      } else if (data.includes(key + myvalue)) {
        console.log("333");
        data = data.filter((item) => item !== key + myvalue);
      } else {
        console.log("444");
        data.push(key + myvalue);
      }
    }
    console.log(data,res2);
    setFavoriteProperties(data);
  };
  const openMsg = (type, msg) => {
    setOpen(true);
    setMsgType(type);
    setMsg(msg);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // end
  async function toggleFavorites() {
    if (isAuthenticated) {
      if (heart === false) {
        let token = await getAccessTokenSilently({ audience, scope });
        try {
          const addFavoriteResponse = await axios.post(
            `${apiOrigin}/user/favorites/wines/${bottle_id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setHeart(true);
          console.log(JSON.parse(addFavoriteResponse));
        } catch (favError) {
          setError(favError);
        }
      } else {
        let token = await getAccessTokenSilently({ audience, scope });
        try {
          const removeFavoriteResponse = await axios.delete(
            `${apiOrigin}/user/favorites/wines/${bottle_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setHeart(false);
          console.log(JSON.stringify(removeFavoriteResponse));
        } catch (favError) {
          setError(favError);
        }
      }
    }
  }
  // start
  const toggleFavoriteProperties = async (value) => {
    console.log("prop", value, neighbors);
    console.log(bottle_id, favoriteProperties, technicalData, value);
    if (isAuthenticated) {
      if (value.property === "Winery") {
        let data = favoriteProperties.find((item) => item === value.property);
        console.log("id", info.winery_id);
        let id = info.winery_id.split("-")[1];
        let res = await addOrDelFavite({
          userId: user_id,
          wineryId: id,
        });
        if (res.code === 200) {
          openMsg(
            "success",
            "success" 
          );
          getFavorites();
        } else {
          openMsg(
            "error",
           "error"
          );
        }
      } else {
        let data = favoriteProperties.find((item) => item === value.property);
        console.log("id", info.winery_id);
        let id = info.winery_id.split("-")[1];
        let res = await addOrDelQualities({
          userId: user_id,
          wineId: info.bottle_id,
          qualityStr: value.key,
        });
        if (res.code === 200) {
          openMsg(
            "success",
            "success"
          );
          getFavorites();
        } else {
          openMsg(
            "error",
            "error"
          );
        }
      }
    }
  };
  const changeFavorite = (property) => {
    if (favoriteProperties === null) {
      setFavoriteProperties([property]);
    } else if (favoriteProperties.includes(property)) {
      setFavoriteProperties(
        favoriteProperties.filter((item) => item !== property)
      );
    } else {
      setFavoriteProperties([...favoriteProperties, property]);
    }
  };
  // end
  async function toggleWineryFavorites(winery_name) {
    if (isAuthenticated) {
      if (wineryHeart === false) {
        let token = await getAccessTokenSilently({ audience, scope });
        try {
          const addFavoriteResponse = await axios.post(
            `${apiOrigin}/user/favorites/wineries/${winery_name}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWineryHeart(true);
          console.log(JSON.stringify(addFavoriteResponse));
        } catch (favError) {
          setError(favError);
        }
      } else {
        let token = await getAccessTokenSilently({ audience, scope });
        try {
          const removeFavoriteResponse = await axios.delete(
            `${apiOrigin}/user/favorites/wineries/${winery_name}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWineryHeart(false);
          console.log(JSON.stringify(removeFavoriteResponse));
        } catch (favError) {
          setError(favError);
        }
      }
    }
  }

  // Fetch a specific bottle form the API.
  useEffect(() => {
    getFavorites();
    async function getBottle() {
      try {
        const res = await axios.get(`${apiOrigin}/techsheets/${bottle_id}`);
        setOverview(parseOverview(res.data));
        setFilePaths(parseFilePaths(res.data));
        setTechnicalData(parseTechnicalData(res.data));
        setNeighbors(parseNeighbors(res.data));
        setInfo(res.data);
        if (isAuthenticated) {
          /* Get JWT from Auth0 (ACCESS TOKEN) */
          let token = await getAccessTokenSilently({ audience, scope });

          try {
            /* If authenticated, check to see if the bottle is the user's favorite. */
            const checkFavoritesStatus = await axios.get(
              `${apiOrigin}/user/favorites/wines/${bottle_id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            /* Set the state according to whether-or-not the user has favorited the wine.*/
            setHeart(true);
            console.log(checkFavoritesStatus);
          } catch (err2) {
            /* Error 404 indicates that the wine is not a favorite! */
            if (err2.response.status === 404) {
              setError(null);
              setHeart(false);
            } else {
              /* Otherwise, we received a normal error. */
              setError(err2);
            }
          }
        }
      } catch (err) {
        setError(err);
      }
    }

    getBottle();
  }, [
    apiOrigin,
    bottle_id,
    audience,
    getAccessTokenSilently,
    isAuthenticated,
    scope,
  ]);

  /* Print any error messages to the console.*/
  if (error) {
    console.log(error.message);
  }

  const toDetail = () => {
    console.log("filepath", filePaths);
    let data = { ...filePaths, ...overview };
    localStorage.setItem("desc", JSON.stringify(data));
    navigate("/winesheetDetail/" + bottle_id);
  };

  return (
    <div className="winesheetPageContainer">
      {/* start */}
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleClose} severity={mesType} sx={{ width: "100%" }}>
          {msg}
        </Alert>
      </Snackbar>
      {/* end */}
      <div className="winesheetPageCard">
        {overview && filePaths && technicalData && neighbors ? (
          <>
            <div className="winesheetPageCardItems">
              {/* Navigation Arrow (Desktop) */}
              <div className="navArrow">
                <Link to={neighbors.prevSheetURL}>
                  <img src={prevIcon} alt="Navigate to Previous Winesheet" />
                </Link>
              </div>

              {/* Title & Subtitle */}
              <div className="technicalData">
                <div className="technicalDataHeader">
                  <span className="title">{overview.title}</span>
                  <div className="btn">
                      <a
                        href = {info.winery_url}
                        class="primaryButton myprimaryButton" 
                      >
                        Visit winery
                      </a>
                    </div>
                  <span className="subtitle" style={{'font-family': "'Montserrat', sans-serif"}}>{info.description}</span>
                </div>

                {/* Technical Data Grid */}
                <div className="technicalDataGrid">
                  {technicalData.map((element) => (
                    <div
                      className="technicalDataGridItem"
                      key={element.property}
                    >
                      <span className="technicalDataGridProperty">
                        {element.property}
                      </span>
                      <span>
                        <span className="technicalDataGridValue">
                          {element.value}
                        </span>
                        {isAuthenticated && (
                          <>
                            {favoriteProperties?.includes(
                              (element.key + element.value).trim()
                            ) ? (
                              <img
                                src={heartIcon}
                                style={{
                                  display: "inline",
                                  cursor: "pointer",
                                  marginLeft: "3px",
                                  transform: "translateY(25%)",
                                }}
                                height="30px"
                                width="30px"
                                alt="(SVGREPO CC0 License) Favorite a Wine"
                                onClick={() =>
                                  toggleFavoriteProperties(element)
                                }
                              />
                            ) : (
                              <img
                                src={emptyHeartIcon}
                                style={{
                                  display: "inline",
                                  cursor: "pointer",
                                  marginLeft: "3px",
                                  transform: "translateY(25%)",
                                }}
                                height="30px"
                                width="30px"
                                alt="(SVGREPO CC0 License) Unfavorite a Wine"
                                onClick={() =>
                                  toggleFavoriteProperties(element)
                                }
                              />
                            )}
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Preview Section */}
              <div className="downloadPreviewElements">
                <div className="previewContainer">
                  {/* Navigation Arrows (Mobile Only) */}
                  <div className="mobile">
                    <Link to={neighbors.prevSheetURL}>
                      <img
                        src={prevIcon}
                        alt="Navigate to Previous Winesheet"
                      />
                    </Link>
                  </div>
                  <div className="thumbnailContainer">
                    {/* Favorite Button (Authenticated Only) */}
                    {isAuthenticated && (
                      <>
                        {heart ? (
                          <img
                            src={heartIcon}
                            className="favoriteButton"
                            height="50px"
                            width="50px"
                            alt="(SVGREPO CC0 License) Favorite a Wine"
                            onClick={() => toggleFavorites()}
                          />
                        ) : (
                          <img
                            src={emptyHeartIcon}
                            className="favoriteButton"
                            height="50px"
                            width="50px"
                            alt="(SVGREPO CC0 License) Unfavorite a Wine"
                            onClick={() => toggleFavorites()}
                          />
                        )}
                      </>
                    )}

                    {/* Winesheet Preview Image */}
                    <a href={filePaths.file} download>
                      <img
                        src={filePaths.thumbnail}
                        className="winesheetPageThumbnail"
                        alt="Winesheet Download Button"
                      />
                    </a>
                  </div>
                  {/* Navigation Arrows (Mobile) */}
                  <div className="mobile">
                    <Link to={neighbors.nextSheetURL}>
                      <img
                        src={nextIcon}
                        alt="Navigate to Previous Winesheet"
                      />
                    </Link>
                  </div>
                </div>
                {/* Download Button */}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="downloadButton">
                    <a
                      href={filePaths.file}
                      className="primaryButton darkPurple big"
                      download
                    >
                      Download Techsheet
                    </a>
                  </div>
                </div>
              </div>
              {/* Navigation Arrow (Desktop) */}
              <div className="navArrow">
                <Link to={neighbors.nextSheetURL}>
                  <img src={nextIcon} alt="Navigate to Next Winesheet" />
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <Loading />
          </>
        )}
      </div>
    </div>
  );
}
