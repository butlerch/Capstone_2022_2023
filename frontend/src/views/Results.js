// State Management & Authentication
import {useState} from "react";
import {getConfig} from "../config/config";

// Routing & Paths
import {useLocation} from "react-router-dom";
import axios from "axios";

// Style & Components
import "../components/TextStyles.css";
import "../components/Buttons.css";
import "./Results.css";
import SearchResult from "../components/SearchResult.js";


export default function Results() {
    const {apiOrigin} = getConfig();

    /* Error Handling */
    const [error, setError] = useState(null);

    /* Parameters */
    const location = useLocation();
    const [results, setResults] = useState(JSON.parse(location.state)["results"]);
    const [searchCriteria, setSearchCriteria] = useState(JSON.parse(location.state)["searchCriteria"])
    const filters = JSON.parse(location.state)["filters"];


    /* Function Description: Clears all state variables related to search.
       Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
    async function clearResults() {
        /* Clear the filters. */
        setError(null);
        setResults(null);

        /* Store new filters.*/
        searchCriteria["keywords"] = "";
        searchCriteria["varietals"] = "";
        searchCriteria["wineryName"] = "";
        searchCriteria["year"] = "";
        setSearchCriteria(searchCriteria);

        /* Execute the new search.*/
        await newSearch();
    }


    /* Function Description: Clears a chosen filter from the state variables.
    Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
    function clearSearchFilter(filter, value) {
        prepareFilterSearch(filter, "");
    }


    /* Function Description: Prepares state variables for a search using the sidebar filters.
       Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
    async function prepareFilterSearch(filter, value) {
        /* Clear the filters. */
        setError(null);
        setResults(null);

        /* Store new filters.*/
        searchCriteria[filter] = value;
        setSearchCriteria(searchCriteria)

        /* Execute the new search.*/
        await newSearch();
    }

    /* Function Description: Performs a new search on the "Search Results" page using various buttons & filters.
       Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
    async function newSearch() {
        /* Build the search string. */
        let keys = Object.keys(searchCriteria);
        let searchString = "/search?keywords=" + searchCriteria.keywords;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== "keywords" && searchCriteria[keys[i]] !== "") {
                searchString = searchString + "&" + keys[i] + "=" + searchCriteria[keys[i]];
            }
        }
        console.log(`Searching for...${searchString}`)
        /* Perform a search; if successful, store the results for display. */
        try {
            const results = await axios.get(`${apiOrigin}${searchString}`);
            setResults(results.data);

        } catch (err) {
            if (err.response.status === 404) {
                setError("Unfortunately, nothing matches those search criteria...");
            } else {
                /* If the response status code isn't 200 or 404, store the status code and error message. */
                setError("Status Code " + err.response.status + ": " + err.message + "!");
            }
        }
    }

    return <>
        <div className="searchResultsContainer">
            <div className="searchResultsSidebar">

                {/* Sidebar Filters */}
                <div className="filterSection">
                    <div className="filterControls">
                        <span className="selectedTitle">Filters</span>
                        <span className="clearButton" onClick={clearResults}>CLEAR ALL</span>
                    </div>

                    {/* Display User's Chosen Filters */}
                    <div className="filterElements">
                        {searchCriteria && searchCriteria["keywords"] && searchCriteria["keywords"] !== "" && searchCriteria["keywords"].length < 25 &&
                            <button id={searchCriteria["keywords"]}
                                    className="primaryButton narrow mediumPurple">{searchCriteria["keywords"]}</button>}
                        {searchCriteria && searchCriteria["varietals"] &&
                            <button id={searchCriteria["varietals"]}
                                    className="primaryButton narrow mediumPurple">
                                {searchCriteria["varietals"]}</button>}
                        {searchCriteria && searchCriteria["wineryName"] &&
                            <button id={searchCriteria["wineryName"]}
                                    className="primaryButton narrow mediumPurple">
                                {searchCriteria["wineryName"]}</button>}
                        {searchCriteria && searchCriteria["year"] &&
                            <button id={searchCriteria["year"]} className="primaryButton narrow mediumPurple">
                                {searchCriteria["year"]}</button>}
                    </div>
                </div>

                {/* Seperator Bar */}
                <div className="separator">
                    <hr className="separatorBar"/>
                </div>

                {/* Display Keywords */}
                {searchCriteria && searchCriteria["keywords"] && searchCriteria["keywords"] !== "" &&
                    <div className="filterSection keywords">
                        <div className="filterTitle">My Keywords</div>
                        <div className="filterElements">
                            <button id={searchCriteria["keywords"]} key={searchCriteria["keywords"]}
                                    className="primaryButton narrow mediumPurple"
                                    onClick={() => clearSearchFilter("keywords", searchCriteria["keywords"])}>{searchCriteria["keywords"]}</button>
                        </div>
                    </div>}


                {/* Display All Possible Filters */}
                <div className="filterSection varietal">
                    <div className="filterTitle">Varietals</div>
                    <div className="filterElements">
                        {filters && filters["varietals"] && filters["varietals"].map((element) => <>
                            {searchCriteria && searchCriteria["varietals"] && element.toString() === searchCriteria["varietals"].toString() ?
                                <button id={element} key={element} className="primaryButton narrow mediumPurple"
                                        onClick={() => clearSearchFilter("varietals", element)}>{element}</button> :
                                <button id={element} key={element} className="primaryButton narrow whiteBordered"
                                        onClick={() => prepareFilterSearch("varietals", element)}>{element}</button>
                            }</>)}</div>
                </div>
                <div className="filterSection winery">
                    <div className="filterTitle">Winery</div>
                    <div className="filterElements">
                        {filters && filters["wineries"] && filters["wineries"].map((element) => <>
                            {searchCriteria && searchCriteria["wineryName"] && element.toString() === searchCriteria["wineryName"].toString() ?
                                <button id={element} key={element} className="primaryButton narrow mediumPurple"
                                        onClick={() => clearSearchFilter("wineryName", element)}>{element}</button> :
                                <button id={element} key={element} className="primaryButton narrow whiteBordered"
                                        onClick={() => prepareFilterSearch("wineryName", element)}>{element}</button>
                            }</>)}
                    </div>
                </div>

                <div className="filterSection year">
                    <div className="filterTitle">Year</div>
                    <div className="filterElements">
                        {filters && filters["years"] && filters["years"].map((element) => <>
                            {searchCriteria && searchCriteria["year"] && element.toString() === searchCriteria["year"].toString() ?
                                <button id={element} key={element} className="primaryButton narrow mediumPurple"
                                        onClick={() => clearSearchFilter("year", element)}>{element}</button> :
                                <button id={element} key={element} className="primaryButton narrow whiteBordered"
                                        onClick={() => prepareFilterSearch("year", element)}>{element}</button>
                            }</>)}
                    </div>
                </div>
                {/* Seperator Bar */}
                <div className="separator">
                    <hr className="separatorBar"/>
                </div>
            </div>

            {/* Search Results */}
            <div className="searchResultsContent">
                {/* Display Search Results */}
                <div className="results">
                    <div className={error == null ? "searchError hidden" : "searchError"}>{error}</div>
                    {!error && results && results.map((x) => <SearchResult
                        key={"wineSearchResultElement | " + x.bottle_id}
                        wine={x}></SearchResult>)}
                    {/* Display Count */}
                    {!error && results && (results.length > 1 ?
                        <div className="resultsCount">showing {results.length} results</div> :
                        <div className="resultsCount">showing {results.length} result </div>)}
                </div>
            </div>
        </div>
    </>
}