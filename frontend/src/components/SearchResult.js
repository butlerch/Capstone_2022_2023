// State Management & Authentication
// -none-

// Routing & Paths
import {Link} from "react-router-dom";

// Style & Components
import './SearchResult.css';
import './Buttons.css';
import './TextStyles.css';
import * as React from "react";
import {parseFilePaths, parseOverview} from "../utils/parseData";

export default function SearchResult({wine}) {
    let overview = parseOverview(wine);
    let filePaths = parseFilePaths(wine);

    return <><Link to={"/winesheets/" + wine.bottle_id}>
        <div className="wineSearchResultContainer">
            <div className="wineSearchResultTextContainer">
                <span className="wineSearchResultTitle">{overview.title}</span>
                <span className="wineSearchResultSubtitle">{overview.subtitle}</span>
            </div>
            <div className="wineSearchResultThumbnailContainer">
                <img src={filePaths.thumbnail} className="wineSearchResultThumbnail"
                     alt="Techsheet Thumbnail Preview"/>
            </div>
        </div>
    </Link></>
}

