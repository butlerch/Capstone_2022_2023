//Authentication
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "./config/config";
// Routing & Paths
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
// Routing & Paths
import axios from "axios";
import {reqUser} from "./api"
// Styling & Components
import "./App.css";
import NavTop from "./components/navbar/NavTop";
import NavBottom from "./components/navbar/NavBottom";
import Loading from "./components/Loading";
import Error from "./components/Error";
import { pushIp } from "./api";
export default function App() {
  const { error, isLoading, user, getAccessTokenSilently, getIdTokenClaims } =
    useAuth0();
  const { apiOrigin, audience, scope } = getConfig();
  const [userData, setUserData] = useState(null);
  const getIp = async () => {
    let res = await axios({
      url: "/getIp",
      method: "get",
    });
    localStorage.setItem("token",await getAccessTokenSilently({ audience, scope }))
    if (res.status === 200) {
      let ip = res.data.split(" ")[1].split("：")[1];
      let result = await pushIp({ ip });
    }
    console.log(res);
  };
  useEffect(async () => {
    
    async function getUser() {
      /* Get JWT from Auth0 (ACCESS TOKEN) */
      const token = await getAccessTokenSilently({ audience, scope });

      try {
        /* GET User */
        const res = await axios.get(`${apiOrigin}/user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem("user_id", res.data.id);
      } catch (err) {
        /* Display the error. */
        console.log(err.message);
      }
      console.log('token',token);
      let res = await reqUser();
    }

    getUser();
    getIp();
  }, []);
  return (
    <div className="appBody">
      <NavTop />
      <div className="navigationSpacer"></div>
      <div id="contentBlock">
        {/* Displays either an error screen, the loading screen, or the appropriate view.*/}
        {error ? <Error error={error} /> : isLoading ? <Loading /> : <Outlet />}
      </div>
      <NavBottom />
    </div>
  );
}
