// State Management & Authentication
import { useEffect, useState } from "react";
import { getConfig } from "../config/config";

// Routing & Paths
import { useLocation } from "react-router-dom";
import axios from "axios";

// Style & Components
import "../components/TextStyles.css";
import "../components/Buttons.css";
import "./Results.css";
import SearchResult from "../components/SearchResult.js";
import { search } from "../api";
export default function Results() {
  const { apiOrigin } = getConfig();

  /* Error Handling */
  const [error, setError] = useState(null);

  /* Parameters */
  const location = useLocation();
  const [results, setResults] = useState(JSON.parse(location.state)["results"]);
  const [searchCriteria, setSearchCriteria] = useState(
    JSON.parse(location.state)["searchCriteria"]
  );
  const filters = JSON.parse(location.state)["filters"];
  const [alcs, setAlc] = useState([]);
  const [phs, setPh] = useState([]);
  const [soils, setSoils] = useState([]);
  const [casesProduceds, setCasesProduced] = useState([
    "100",
    "100-500",
    "500-1000",
    "1000+",
  ]);

  /* Function Description: Clears all state variables related to search.
       Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
  async function clearResults() {
    /* Clear the filters. */
    setError(null);
    setResults(null);

    /* Store new filters.*/
    searchCriteria["wineName"] = "";
    searchCriteria["varietals"] = "";
    searchCriteria["wineryName"] = "";
    searchCriteria["year"] = "";
    searchCriteria["Alc"] = "";
    searchCriteria["Ph"] = "";
    searchCriteria["Soils"] = "";
    searchCriteria["CasesProduced"] = "";
    setSearchCriteria(searchCriteria);

    /* Execute the new search.*/
    await newSearch();
  }

  /* Function Description: Clears a chosen filter from the state variables.
    Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
  function clearSearchFilter(filter, value) {
    console.log(filter);
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
    setSearchCriteria(searchCriteria);

    /* Execute the new search.*/
    await newSearch();
  }

  /* Function Description: Performs a new search on the "Search Results" page using various buttons & filters.
       Requirements: Access to useState variables (error & setError, searchCriteria & setSearchCriteria, and results & setResults). */
  async function newSearch() {
    /* Build the search string. */
    let keys = Object.keys(searchCriteria);
    let data = {};
    if (searchCriteria.wineName) {
      data["wineName"] = searchCriteria.wineName;
    }
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== "wineName" && searchCriteria[keys[i]] !== "") {
        data[keys[i]] = searchCriteria[keys[i]];
      }
    }
    console.log(data, "url");
    /* Perform a search; if successful, store the results for display. */
    try {
      const results = await search(data);
      setResults(results);
    } catch (err) {
      if (err.response.status === 404) {
        setError("Unfortunately, nothing matches those search criteria...");
      } else {
        /* If the response status code isn't 200 or 404, store the status code and error message. */
        setError(
          "Status Code " + err.response.status + ": " + err.message + "!"
        );
      }
    }
  }
  useEffect(() => {
    let ph = 2.8;
    let data = [];
    while (ph < 4.1) {
      data.push(Number(ph.toFixed(2)));
      ph += 0.1;
      if (Number(ph.toFixed(2)) <= 4) {
        setPh(data);
      }
    }
    let alc = 8;
    let data2 = [];
    while (alc <= 20) {
      data2.push(alc + "%");
      alc += 1;
      if (alc <= 100) {
        setAlc(data2);
      }
    }
    let soil = 0;
    let data3 = [
      { value: 0, name: "zero" },
      { value: 1, name: "one" },
      { value: 2, name: "two" },
      { value: 3, name: "three" },
      { value: 4, name: "four" },
      { value: 5, name: "five" },
      { value: 6, name: "six" },
      { value: 7, name: "seven" },
      { value: 8, name: "eight" },
      { value: 9, name: "nine" },
      { value: 10, name: "ten" },
      { value: 11, name: "eleven" },
      { value: 12, name: "twelve" },
      { value: 13, name: "thirteen" },
      { value: 14, name: "fourteen" },
      { value: 15, name: "fifteen" },
      { value: 16, name: "sixteen" },
      { value: 17, name: "seventeen" },
      { value: 18, name: "eighteen" },
      { value: 19, name: "nineteen" },
      { value: 20, name: "twenty" },
      { value: 21, name: "twenty-one" },
      { value: 22, name: "twenty-two" },
      { value: 23, name: "twenty-three" },
      { value: 24, name: "twenty-four" },
      { value: 25, name: "twenty-five" },
      { value: 26, name: "twenty-six" },
      { value: 27, name: "twenty-seven" },
      { value: 28, name: "twenty-eight" },
      { value: 29, name: "twenty-nine" },
      { value: 30, name: "thirty" },
      { value: 31, name: "thirty-one" },
      { value: 32, name: "thirty-two" },
      { value: 33, name: "thirty-three" },
      { value: 34, name: "thirty-four" },
      { value: 35, name: "thirty-five" },
      { value: 36, name: "thirty-six" },
      { value: 37, name: "thirty-seven" },
      { value: 38, name: "thirty-eight" },
      { value: 39, name: "thirty-nine" },
      { value: 40, name: "forty" },
      { value: 41, name: "forty-one" },
      { value: 42, name: "forty-two" },
      { value: 43, name: "forty-three" },
      { value: 44, name: "forty-four" },
      { value: 45, name: "forty-five" },
      { value: 46, name: "forty-six" },
      { value: 47, name: "forty-seven" },
      { value: 48, name: "forty-eight" },
      { value: 49, name: "forty-nine" },
      { value: 50, name: "fifty" },
      { value: 51, name: "fifty-one" },
      { value: 52, name: "fifty-two" },
      { value: 53, name: "fifty-three" },
      { value: 54, name: "fifty-four" },
      { value: 55, name: "fifty-five" },
      { value: 56, name: "fifty-six" },
      { value: 57, name: "fifty-seven" },
      { value: 58, name: "fifty-eight" },
      { value: 59, name: "fifty-nine" },
      { value: 60, name: "sixty" },
      { value: 61, name: "sixty-one" },
      { value: 62, name: "sixty-two" },
      { value: 63, name: "sixty-three" },
      { value: 64, name: "sixty-four" },
      { value: 65, name: "sixty-five" },
      { value: 66, name: "sixty-six" },
      { value: 67, name: "sixty-seven" },
      { value: 68, name: "sixty-eight" },
      { value: 69, name: "sixty-nine" },
      { value: 70, name: "seventy" },
      { value: 71, name: "seventy-one" },
      { value: 72, name: "seventy-two" },
      { value: 73, name: "seventy-three" },
      { value: 74, name: "seventy-four" },
      { value: 75, name: "seventy-five" },
      { value: 76, name: "seventy-six" },
      { value: 77, name: "seventy-seven" },
      { value: 78, name: "seventy-eight" },
      { value: 79, name: "seventy-nine" },
      { value: 80, name: "eighty" },
      { value: 81, name: "eighty-one" },
      { value: 82, name: "eighty-two" },
      { value: 83, name: "eighty-three" },
      { value: 84, name: "eighty-four" },
      { value: 85, name: "eighty-five" },
      { value: 86, name: "eighty-six" },
      { value: 87, name: "eighty-seven" },
      { value: 88, name: "eighty-eight" },
      { value: 89, name: "eighty-nine" },
      { value: 90, name: "ninety" },
      { value: 91, name: "ninety-one" },
      { value: 92, name: "ninety-two" },
      { value: 93, name: "ninety-three" },
      { value: 94, name: "ninety-four" },
      { value: 95, name: "ninety-five" },
      { value: 96, name: "ninety-six" },
      { value: 97, name: "ninety-seven" },
      { value: 98, name: "ninety-eight" },
      { value: 99, name: "ninety-nine" },
      { value: 100, name: "one hundred" },
    ];
    setSoils(data3)
  }, []);
  return (
    <>
      <div className="searchResultsContainer">
        <div className="searchResultsSidebar">
          {/* Sidebar Filters */}
          <div className="filterSection">
            <div className="filterControls">
              <span className="selectedTitle">Filters</span>
              <span className="clearButton" onClick={clearResults}>
                CLEAR ALL
              </span>
            </div>

            {/* Display User's Chosen Filters */}
            <div className="filterElements">
              {searchCriteria &&
                searchCriteria["keywords"] &&
                searchCriteria["keywords"] !== "" &&
                searchCriteria["keywords"].length < 25 && (
                  <button
                    id={searchCriteria["keywords"]}
                    className="primaryButton narrow mediumPurple"
                  >
                    {searchCriteria["keywords"]}
                  </button>
                )}
              {searchCriteria && searchCriteria["varietals"] && (
                <button
                  id={searchCriteria["varietals"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["varietals"]}
                </button>
              )}
              {searchCriteria && searchCriteria["wineryName"] && (
                <button
                  id={searchCriteria["wineryName"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["wineryName"]}
                </button>
              )}
              {searchCriteria && searchCriteria["year"] && (
                <button
                  id={searchCriteria["year"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["year"]}
                </button>
              )}
              {searchCriteria && searchCriteria["Alc"] && (
                <button
                  id={searchCriteria["Alc"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["Alc"]}
                </button>
              )}
              {searchCriteria && searchCriteria["Ph"] && (
                <button
                  id={searchCriteria["Ph"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["Ph"]}
                </button>
              )}
              {searchCriteria && searchCriteria["Soils"] && (
                <button
                  id={searchCriteria["Soils"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["Soils"]}
                </button>
              )}
              {searchCriteria && searchCriteria["CasesProduced"] && (
                <button
                  id={searchCriteria["CasesProduced"]}
                  className="primaryButton narrow mediumPurple"
                >
                  {searchCriteria["CasesProduced"]}
                </button>
              )}
            </div>
          </div>

          {/* Seperator Bar */}
          <div className="separator">
            <hr className="separatorBar" />
          </div>

          {/* Display Keywords */}
          {searchCriteria &&
            searchCriteria["keywords"] &&
            searchCriteria["keywords"] !== "" && (
              <div className="filterSection keywords">
                <div className="filterTitle">My Keywords</div>
                <div className="filterElements">
                  <button
                    id={searchCriteria["keywords"]}
                    key={searchCriteria["keywords"]}
                    className="primaryButton narrow mediumPurple"
                    onClick={() =>
                      clearSearchFilter("keywords", searchCriteria["keywords"])
                    }
                  >
                    {searchCriteria["keywords"]}
                  </button>
                </div>
              </div>
            )}

          {/* Display All Possible Filters */}
          <div className="filterSection varietal">
            <div className="filterTitle">Varietals</div>
            <div className="filterElements">
              {filters &&
                filters["varietals"] &&
                filters["varietals"].map((element) => (
                  <>
                    {searchCriteria &&
                    searchCriteria["varietals"] &&
                    element.toString() ===
                      searchCriteria["varietals"].toString() ? (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow mediumPurple"
                        onClick={() => clearSearchFilter("varietals", element)}
                      >
                        {element}
                      </button>
                    ) : (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow whiteBordered"
                        onClick={() =>
                          prepareFilterSearch("varietals", element)
                        }
                      >
                        {element}
                      </button>
                    )}
                  </>
                ))}
            </div>
          </div>
          <div className="filterSection winery">
            <div className="filterTitle">Winery</div>
            <div className="filterElements">
              {filters &&
                filters["wineries"] &&
                filters["wineries"].map((element) => (
                  <>
                    {searchCriteria &&
                    searchCriteria["wineryName"] &&
                    element.toString() ===
                      searchCriteria["wineryName"].toString() ? (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow mediumPurple"
                        onClick={() => clearSearchFilter("wineryName", element)}
                      >
                        {element}
                      </button>
                    ) : (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow whiteBordered"
                        onClick={() =>
                          prepareFilterSearch("wineryName", element)
                        }
                      >
                        {element}
                      </button>
                    )}
                  </>
                ))}
            </div>
          </div>

          <div className="filterSection year">
            <div className="filterTitle">Year</div>
            <div className="filterElements">
              {filters &&
                filters["years"] &&
                filters["years"].map((element) => (
                  <>
                    {searchCriteria &&
                    searchCriteria["year"] &&
                    element.toString() === searchCriteria["year"].toString() ? (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow mediumPurple"
                        onClick={() => clearSearchFilter("year", element)}
                      >
                        {element}
                      </button>
                    ) : (
                      <button
                        id={element}
                        key={element}
                        className="primaryButton narrow whiteBordered"
                        onClick={() => prepareFilterSearch("year", element)}
                      >
                        {element}
                      </button>
                    )}
                  </>
                ))}
            </div>
          </div>
          <div className="filterSection year">
            <div className="filterTitle">Alc</div>
            <div className="filterElements">
              {alcs.map((element) => (
                <>
                  {searchCriteria &&
                  searchCriteria["Alc"] &&
                  element.toString() === searchCriteria["Alc"].toString() ? (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow mediumPurple"
                      onClick={() => clearSearchFilter("Alc", element)}
                    >
                      {element}
                    </button>
                  ) : (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow whiteBordered"
                      onClick={() => prepareFilterSearch("Alc", element)}
                    >
                      {element}
                    </button>
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="filterSection year">
            <div className="filterTitle">Ph</div>
            <div className="filterElements">
              {phs.map((element) => (
                <>
                  {searchCriteria &&
                  searchCriteria["Ph"] &&
                  element.toString() === searchCriteria["Ph"].toString() ? (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow mediumPurple"
                      onClick={() => clearSearchFilter("Ph", element)}
                    >
                      {element}
                    </button>
                  ) : (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow whiteBordered"
                      onClick={() => prepareFilterSearch("Ph", element)}
                    >
                      {element}
                    </button>
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="filterSection year">
            <div className="filterTitle">Soils</div>
            <div className="filterElements">
              {soils.map((element) => (
                
                <>
                  {searchCriteria &&
                  searchCriteria["Soils"] &&
                  element.toString() === searchCriteria["Soils"].toString() ? (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow mediumPurple"
                      onClick={() => clearSearchFilter("Soils", element.value)}
                    >
                      {element}
                    </button>
                  ) : (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow whiteBordered"
                      onClick={() => prepareFilterSearch("Soils", element.value)}
                    >
                      {element.name}
                    </button>
                  )}
                </>
              ))}
            </div>
          </div>
          <div className="filterSection year">
            <div className="filterTitle">Cases Produced</div>
            <div className="filterElements">
              {casesProduceds.map((element) => (
                <>
                  {searchCriteria &&
                  searchCriteria["CasesProduced"] &&
                  element.toString() ===
                    searchCriteria["CasesProduced"].toString() ? (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow mediumPurple"
                      onClick={() =>
                        clearSearchFilter("CasesProduced", element)
                      }
                    >
                      {element}
                    </button>
                  ) : (
                    <button
                      id={element}
                      key={element}
                      className="primaryButton narrow whiteBordered"
                      onClick={() =>
                        prepareFilterSearch("CasesProduced", element)
                      }
                    >
                      {element}
                    </button>
                  )}
                </>
              ))}
            </div>
          </div>
          {/* Seperator Bar */}
          <div className="separator">
            <hr className="separatorBar" />
          </div>
        </div>

        {/* Search Results */}
        <div className="searchResultsContent">
          {/* Display Search Results */}
          <div className="results">
            <div
              className={error == null ? "searchError hidden" : "searchError"}
            >
              {error}
            </div>
            {!error &&
              results &&
              results.map((x) => (
                <SearchResult
                  key={"wineSearchResultElement | " + x.bottle_id}
                  wine={x}
                ></SearchResult>
              ))}
            {/* Display Count */}
            {!error &&
              results &&
              (results.length > 1 ? (
                <div className="resultsCount">
                  showing {results.length} results
                </div>
              ) : (
                <div className="resultsCount">
                  showing {results.length} result{" "}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
