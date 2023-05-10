// State Management & Authentication
import { getConfig } from "../config/config";
import { useEffect, useState } from "react";

// Routing & Paths
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Style & Components
import "./Landing.css";
import Loading from "../components/Loading";
import "../components/TextStyles.css";
import "../components/SearchBox.css";
import "../components/DropdownSelect.css";
import searchIcon from "../images/search.svg";
import arrowDown from "../images/arrow_drop_down.svg";
import "../components/Buttons.css";
import { parseFilePaths } from "../utils/parseData";

export default function Landing() {
  const { apiOrigin } = getConfig();
  const navigate = useNavigate();

  /* State for the background grid on the landing page & the search box. */
  const [grid, setGrid] = useState([]);
  const totalGridItems = 16;
  const techsheetThumbnailSize = "200px";

  /* Select Menu Dropdown Items */
  const [filters, setFilters] = useState(false);

  /* Search Form Data */
  const [keywords, setKeywords] = useState("");
  const [varietal, setVarietal] = useState("");
  const [wineryName, setWineryName] = useState("");
  const [year, setYear] = useState("");
  const [alcs, setAlc] = useState([]);
  const [phs, setPh] = useState([]);
  const [soils, setSoils] = useState([]);
  const [casesProduceds, setCasesProduced] = useState([
    "100",
    "100-500",
    "500-1000",
    "1000+",
  ]);
  /* Error Handling */
  const [error, setError] = useState(null);

  /* Search Results */
  const [randomWinesheetPath, setRandomWinesheetPath] =
    useState("winesheets/1");

  /* Advanced Options Toggle */
  const [toggle, setToggle] = useState(false);

  function toggleAdvancedMenu() {
    if (toggle === true) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }

  /* Builds the packet containing the search results and criteria. */
  async function search() {
    /* Store the search criteria in an object.*/
    let searchCriteria = {};
    searchCriteria.keywords = keywords;
    searchCriteria.varietals = varietal;
    searchCriteria.wineryName = wineryName;
    searchCriteria.year = year;

    /* Build the search string. */
    let keys = Object.keys(searchCriteria);
    let searchString = "?keywords=" + keywords;
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== "keywords" && searchCriteria[keys[i]] !== "") {
        searchString =
          searchString + "&" + keys[i] + "=" + searchCriteria[keys[i]];
      }
    }

    try {
      /* Perform a search; if successful, pass state & navigate to the "Search Results" page. */
      const results = await axios.get(`${apiOrigin}/search${searchString}`);

      let keys = [];

      /* Format the search criteria for passage as state. */
      keys = Object.keys(searchCriteria);
      let formattedSearchCriteria = {};
      for (let i = 0; i < keys.length; i++) {
        if (searchCriteria[keys[i]] !== "") {
          formattedSearchCriteria[keys[i]] = searchCriteria[keys[i]];
        }
      }

      /* Format all potential filters for passage as state.*/
      keys = Object.keys(filters);
      let formattedFilters = {};
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== "total_count" && filters[keys[i]].length > 0) {
          formattedFilters[keys[i]] = filters[keys[i]];
        }
      }

      let state = {
        searchCriteria: formattedSearchCriteria,
        results: results.data,
        filters: formattedFilters,
        totalCount: filters["total_count"],
      };
      navigate("/results", { state: JSON.stringify(state) });
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
    async function getGridData() {
      try {
        /* Get a random assortment of bottles. */
        const res = await axios.get(
          `${apiOrigin}/random?quantity=${totalGridItems}`
        );

        /* Set aside one of the random wines for the 'Surprise Me?!' button.*/
        setRandomWinesheetPath(
          "winesheets/" + res.data[res.data.length - 1]["bottle_id"]
        );

        let wines = [];

        for (let i = 0; i < res.data.length; i++) {
          let wine = parseFilePaths(res.data[i]);
          wines.push(wine);
        }
        setGrid(wines);
      } catch (err) {
        /* Display the error. */
        setError(err.message);
      }
    }

    /* Fetch options to populate the dropdown menu under "Advanced Search." */
    async function fetchFilters() {
      let formattedFilters = {};

      /* Build the "Years" dropdown menu. */
      let currentYear = new Date().getFullYear();
      formattedFilters.years = [];
      for (let i = 2015; i <= currentYear; i++) {
        formattedFilters.years.push(i);
      }
      let ph = 2.8;
      let data = [];
      while (ph <= 4.1) {
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
      setSoils([
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
      ]);
      try {
        /* Fetch "Wineries" */
        let res1 = await axios(`${apiOrigin}/listOfWineries`);
        formattedFilters.wineries = res1.data.wineries;
        try {
          /* Fetch varietals. */
          let res2 = await axios(`${apiOrigin}/varietalNames`);
          formattedFilters.varietals = res2.data.varietals;
          setFilters(formattedFilters);
        } catch (err) {
          /* Display the error. */
          setError("Error loading dropdown menu options. Please refresh.");
        }
      } catch (err) {
        /* Display the error. */
        setError("Error loading dropdown menu options. Please refresh.");
      }
    }

    getGridData();
    fetchFilters();
  }, [apiOrigin]);

  /* Loads the Search Box on top of the grid elements.*/
  return (
    <>
      {!error && grid.length < 1 && !filters ? (
        <Loading />
      ) : (
        <div className="landingContainer">
          <div className="searchContainer">
            <div className="searchCardText">
              <div className="searchCardTitle title">
                Search wine techsheets!
              </div>
              <div className="defaultSearch">
                {/* Search Box */}
                <div className="searchBarContainer">
                  <img
                    className="searchIcon"
                    src={searchIcon}
                    alt="Search Icon"
                  />
                  <input
                    className="searchBar"
                    placeholder="Search by Wine Name or Varietal"
                    type="text"
                    name="keywords"
                    value={keywords}
                    onChange={(x) => setKeywords(x.target.value)}
                  />
                </div>
                {/* Submits the Form */}
                <button
                  className="primaryButton narrow mediumPurple"
                  onClick={search}
                >
                  Search
                </button>
              </div>
              {/* If there's an error, displays the error. */}
              <div
                className={error == null ? "searchError hidden" : "searchError"}
              >
                {error}
              </div>
              {/* Advanced Search */}
              <div className="advancedSearch">
                <div
                  className="advancedSearchMenu"
                  onClick={toggleAdvancedMenu}
                >
                  Advanced Search{" "}
                  <img
                    className="arrowIcon"
                    alt="Display Advanced Search Options"
                    src={arrowDown}
                  />
                </div>
                <div
                  className={
                    toggle
                      ? "advancedSearchOptions"
                      : "advancedSearchOptions hidden"
                  }
                >
                  {/* Varietal Selections */}
                  <div className="selectContainer" alt="Select a Wine Varietal">
                    <select
                      className="selectDropdown"
                      name="varietal"
                      value={varietal}
                      onChange={(x) => setVarietal(x.target.value)}
                    >
                      <option value="">- Wine Varietal -</option>
                      {filters &&
                        filters["varietals"].map((element) => (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Winery Selections */}
                  <div className="selectContainer" alt="Select a Winery">
                    <select
                      className="selectDropdown"
                      name="wine"
                      value={wineryName}
                      onChange={(x) => setWineryName(x.target.value)}
                    >
                      <option value="">- Winery -</option>
                      {filters &&
                        filters["wineries"].map((element) => (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Year Selections */}
                  <div className="selectContainer">
                    <select
                      className="selectDropdown"
                      name="year"
                      value={year}
                      onChange={(x) => setYear(x.target.value)}
                    >
                      <option value="">- Vintage Year -</option>
                      {filters &&
                        filters["years"].map((element) => (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Varietal Selections */}
                  <div className="selectContainer" alt="Select a Wine Varietal">
                    <select
                      className="selectDropdown"
                      name="varietal"
                      value={varietal}
                      onChange={(x) => setVarietal(x.target.value)}
                    >
                      <option value="">- Alc -</option>
                      {alcs.map((element) => (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Varietal Selections */}
                  <div className="selectContainer" alt="Select a Wine Varietal">
                    <select
                      className="selectDropdown"
                      name="varietal"
                      value={varietal}
                      onChange={(x) => setVarietal(x.target.value)}
                    >
                      <option value="">- Ph -</option>
                      {phs &&
                        phs.map((element) => (
                          <option key={element} value={element}>
                            {element}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* Varietal Selections */}
                  <div className="selectContainer" alt="Select a Wine Varietal">
                    <select
                      className="selectDropdown"
                      name="varietal"
                      value={varietal}
                      onChange={(x) => setVarietal(x.target.value)}
                    >
                      <option value="">- Soils -</option>
                      {soils.map((element) => (
                        <option key={element.value} value={element.value}>
                          {element.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Varietal Selections */}
                  <div className="selectContainer" alt="Select a Wine Varietal">
                    <select
                      className="selectDropdown"
                      name="varietal"
                      value={varietal}
                      onChange={(x) => setVarietal(x.target.value)}
                    >
                      <option value="">- Cases Produced -</option>
                      {casesProduceds.map((element) => (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="surpriseMe">
                <Link
                  to={randomWinesheetPath}
                  className="primaryButton big darkPurple"
                >
                  Surprise Me?!
                </Link>
              </div>
            </div>
          </div>
          {/* If the server query was successful, display the winesheets landing-page grid.*/}
          {grid.map((element) => (
            <Link to={element.clientURL} key={element.file}>
              <div className="wineGridItem">
                <img
                  src={element.thumbnail}
                  width={techsheetThumbnailSize}
                  height={techsheetThumbnailSize}
                  alt={`${element.filename} Winesheet`}
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
