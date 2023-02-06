// Description: This page is responsible for mapping out the application's routes.
// Auth0 is configured and setup here.

// React Setup
import React from 'react';
import ReactDOM from 'react-dom/client';

// Authentication
import {Auth0Provider} from "@auth0/auth0-react";
import {getConfig} from "./config/config";
import history from "./utils/history";

// Routing & Paths
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Landing from "./views/Landing";
import Profile from "./views/Profile";
import About from "./views/About";
import Contact from "./views/Contact";
import Developer from "./views/Developer";
import Winesheets from "./views/Winesheets";
import Winesheet from "./components/Winesheet";

// Styling & Components
import './index.css';
import App from './App';

// Testing
import reportWebVitals from './test/reportWebVitals';
import Results from "./views/Results";
import Submit from "./views/Submit";


// Auth0 Configuration
const onRedirectCallback = (appState) => {
    history.push(
        appState && appState.returnTo ? appState.returnTo : window.location.pathname
    );
};

const config = getConfig();

const providerConfig = {
    domain: config.domain,
    clientId: config.clientId,
    ...(config.audience ? {audience: config.audience} : null),
    redirectUri: window.location.origin,
    onRedirectCallback,
};


// Renders the root of the application.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Auth0Provider {...providerConfig}>
        {/* Routing/Paths */}
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route index element={<Landing/>}/>
                    <Route path="results" element={<Results/>}/>
                    <Route path="profile" element={<Profile/>}/>
                    <Route path="about" element={<About/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path="developer" element={<Developer/>}/>
                    <Route path="submit" element={<Submit/>}/>
                    <Route path="winesheets" element={<Winesheets/>}>
                        <Route path=":winesheetId" element={<Winesheet/>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </Auth0Provider>
);


// Analytics
// This function accepts another function and performs some analytics.
// Here, it logs performance metrics to the console.
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
