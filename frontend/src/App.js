//Authentication
import {useAuth0} from "@auth0/auth0-react";

// Routing & Paths
import {Outlet} from "react-router-dom";

// Styling & Components
import './App.css';
import NavTop from './components/navbar/NavTop';
import NavBottom from "./components/navbar/NavBottom";
import Loading from "./components/Loading";
import Error from "./components/Error";


export default function App() {
    const {error, isLoading} = useAuth0();

    return (<div className="appBody">
            <NavTop/>
            <div className="navigationSpacer"></div>
            <div id="contentBlock">
                {/* Displays either an error screen, the loading screen, or the appropriate view.*/}
                {error ? <Error error={error}/> : (isLoading ? <Loading/> : <Outlet/>)}
            </div>
            <NavBottom/>
        </div>
    );
}