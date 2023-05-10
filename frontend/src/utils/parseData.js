/* Description: These helper functions parse data for display. */

/* Function Description: Given a winesheet, builds the title & subtitle strings for various components. */
export function parseOverview(techsheetData) {
  let overview = {};
  overview.title =
    (techsheetData["year"] || "") +
    " " +
    (cleanString(techsheetData["winery_name"]) || "") +
    " " +
    techsheetData["wine_name"];
  overview.bottle_id = techsheetData["bottle_id"];

  /* Parse the wine name, a string array.*/
  if (
    techsheetData &&
    techsheetData["wine_name"] &&
    techsheetData["wine_name"].length > 0 &&
    techsheetData["wine_name"][0] !== "NULL"
  ) {
    overview.subtitle = cleanString(techsheetData["wine_name"][0]);
    for (let i = 1; i < techsheetData["wine_name"].length; i++) {
      overview.subtitle =
        overview.subtitle + ", " + cleanString(techsheetData["wine_name"][i]);
    }
  }

  return overview;
}

/* Description: Given a techsheet object, builds paths to the download asset (a pdf) and preview asset (an image).*/
export function parseFilePaths(
  techsheetData,
  fileDirectory = "/pdfs/",
  fileFormat = ".pdf",
  thumbnailDirectory = "/thumbnails/",
  thumbnailFormat = ".png"
) {
  /* Error handling.*/
  if (
    !techsheetData["source_file"] ||
    techsheetData["source_file"].length < 6
  ) {
    return false;
  }

  let overview = {};

  /* If necessary, strips a faulty json extension from the source file. */
  if (
    techsheetData["source_file"].substring(
      techsheetData["source_file"].length - 5
    ) === ".json" ||
    techsheetData["source_file"].substring(
      techsheetData["source_file"].length - 5
    ) === ".jpeg"
  ) {
    overview.filename = techsheetData["source_file"].substring(
      0,
      techsheetData["source_file"].length - 5
    );
  }

  /* For ease of execution, strips pdf file handler from source file. */
  if (
    techsheetData["source_file"].substring(
      techsheetData["source_file"].length - 4
    ) === ".pdf" ||
    techsheetData["source_file"].substring(
      techsheetData["source_file"].length - 4
    ) === ".jpg" ||
    techsheetData["source_file"].substring(
      techsheetData["source_file"].length - 4
    ) === ".png"
  ) {
    overview.filename = techsheetData["source_file"].substring(
      0,
      techsheetData["source_file"].length - 4
    );
  }

  /* Encode the filename.*/
  overview.filename = encodeFileName(overview.filename);

  /* Builds a URL path to the file & thumbnail preview.*/
  overview.file = fileDirectory + overview.filename + fileFormat;
  overview.thumbnail = thumbnailDirectory + overview.filename + thumbnailFormat;

  /* Builds an internal URL path to the techsheet. */
  if (techsheetData && techsheetData["bottle_id"]) {
    overview.clientURL = "/winesheets/" + techsheetData["bottle_id"];
  }

  return overview;
}

/* Description: Given a techsheet object, builds next & previous URLs. */
export function parseNeighbors(techsheetData, path = "/winesheets/") {
  let neighbors = {};

  /* Checks to see if the server sent a database count; defaults to 10.*/
  let totalTechsheets = 10;
  if (techsheetData.total_sheets !== undefined) {
    totalTechsheets = techsheetData.total_sheets;
  }

  /* Build next/prev URLs. */
  if (
    techsheetData["bottle_id"] > 1 &&
    techsheetData["bottle_id"] < totalTechsheets
  ) {
    neighbors.prevSheetURL = path + (techsheetData["bottle_id"] - 1);
    neighbors.nextSheetURL = path + (techsheetData["bottle_id"] + 1);
  } else if (techsheetData["bottle_id"] === 1) {
    neighbors.prevSheetURL = path + totalTechsheets;
    neighbors.nextSheetURL = path + (techsheetData["bottle_id"] + 1);
  } else {
    neighbors.prevSheetURL = path + (techsheetData["bottle_id"] - 1);
    neighbors.nextSheetURL = path + 1;
  }
  return neighbors;
}

/* Function Description: Parses technical data so that each key/value pair can be displayed (ex: as title/content).*/
export function parseTechnicalData(techsheetData) {
  let technicalData = [];

  /* Parse aging_process, a string, and capitalize the first letter of its value.*/
  if (
    techsheetData &&
    techsheetData["aging_process"] &&
    techsheetData["wine_name"].length > 0 &&
    techsheetData["aging_process"] !== "NULL"
  ) {
    technicalData.push({
      property: "Aging Process",
      value:
        techsheetData["aging_process"][0].toUpperCase() +
        techsheetData["aging_process"].substring(1),
      key: "aging_process",
    });
  }

  /* Parse cases_produced, an integer.*/
  if (Number.isInteger(techsheetData["cases_produced"])) {
    technicalData.push({
      property: "Cases Produced",
      value: techsheetData["cases_produced"],
      key: "cases_produced",
    });
  }

  /* Parse clones, a string array.*/
  /* Create a string based on the array contents.*/
  let clonesString = "";
  if (
    techsheetData["clones"].length > 0 &&
    techsheetData["clones"][0] !== "NULL"
  ) {
    clonesString = cleanString(techsheetData["clones"][0]);

    if (techsheetData["clones"].length > 1) {
      for (let i = 1; i < techsheetData["clones"].length; i++) {
        clonesString =
          clonesString + ", " + cleanString(techsheetData["clones"][i]);
      }
    }
  }

  /* Store the string as a displayable property.*/
  if (clonesString.length > 0) {
    technicalData.push({
      property: "Clones",
      value: clonesString,
      key: "clones",
    });
  }

  /* Parse clusters, a string.*/
  if (
    techsheetData["clusters"] !== "NULL" &&
    techsheetData["clusters"] !== undefined
  ) {
    technicalData.push({
      property: "Clusters",
      value: cleanString(techsheetData["clusters"]),
      key: "clusters",
    });
  }

  /* Parse % Alcohol, a string.*/
  if (
    techsheetData["pct_alcohol"] !== "NULL" &&
    techsheetData["pct_alcohol"] !== undefined
  ) {
    technicalData.push({
      property: "Alcohol Percentage",
      value: cleanString(techsheetData["pct_alcohol"]),
      key: "pct_alcohol",
    });
  }

  /* Parse pH, a string.*/
  if (techsheetData["ph"] !== "NULL" && techsheetData["ph"] !== undefined) {
    technicalData.push({
      property: "pH",
      value: cleanString(techsheetData["ph"]),
      key: "ph",
    });
  }

  /* Parse pH, a string.*/
  if (
    techsheetData["winery_name"] !== "NULL" &&
    techsheetData["winery_name"] !== undefined
  ) {
    technicalData.push({
      property: "Winery",
      value: cleanString(techsheetData["winery_name"]),
      key: "winery_name",
    });
  }

  /* Parse soils, a string array.*/
  /* Create a string based on the array contents.*/
  let soilsString = "";

  let cleanSoils = techsheetData["soils"]
    .filter((element) => element.trim() !== "")
    .map((element) => cleanString(element));
  if (cleanSoils.length > 0 && cleanSoils[0] !== "NULL") {
    soilsString = cleanSoils[0];
    if (cleanSoils.length > 1) {
      for (let i = 1; i < cleanSoils.length; i++) {
        soilsString = soilsString + ", " + cleanSoils[i];
      }
    }
  }
  /* Store the string as a displayable property.*/
  if (soilsString.length > 0) {
    technicalData.push({ property: "Soils", value: soilsString,key: "soils" });
  }

  /* Parse TA, a string.*/
  if (techsheetData["ta"] !== "NULL" && techsheetData["ta"] !== undefined) {
    technicalData.push({
      property: "TA",
      value: cleanString(techsheetData["ta"]),
      key: "ta"
    });
  }

  /* Parse varietals, a string array.*/
  /* Create a string based on the array contents.*/
  let varietalsString = "";
  if (
    techsheetData["varietals"].length > 0 &&
    techsheetData["varietals"][0] !== "NULL"
  ) {
    varietalsString = cleanString(techsheetData["varietals"][0]);

    if (techsheetData["varietals"].length > 1) {
      for (let i = 1; i < techsheetData["varietals"].length; i++) {
        varietalsString =
          varietalsString + ", " + cleanString(techsheetData["varietals"][i]);
      }
    }
  }

  /* Store the string as a displayable property.*/
  if (varietalsString.length > 0) {
    technicalData.push({ property: "Varietals", value: varietalsString,key: "varietals" });
  }
  return technicalData;
}

/* Function Description: Given a list, cleans the data inside the list. */
export function parseCategory(list) {
  let string = "";

  let cleanList = list
    .filter((element) => element.trim() !== "")
    .map((element) => cleanString(element));
  if (
    cleanList.length > 0 &&
    cleanList[0] !== "NULL" &&
    cleanList[0] !== undefined
  ) {
    string = cleanList[0];
    if (cleanList.length > 1) {
      for (let i = 1; i < cleanList.length; i++) {
        string = string + ", " + cleanList[i];
      }
    }
  }

  return string;
}

/* Function Description: Given a string, tidies it's formatting up for display. */
function cleanString(string, numbers = true) {
  /* Error handling. */
  if (!string || string.length === undefined || string.length <= 0) {
    return "";
  }

  /* If indicated, remove extraneous numbers and some symbols (% - ). */
  if (numbers === false) {
    string = string.replace(/[0-9%-]+/g, "");
  }

  /* Trim whitespace */
  string = string.trim();

  /* Capitalize the first letter of each word. */
  try {
    string = string.split(" ");
    string = string
      .map((x) => {
        return x[0].toUpperCase() + x.substring(1);
      })
      .join(" ");
  } catch (error) {
    console.log(error);
  }

  return string;
}

/* Function Description: Remove any accented characters from a string (ex: "Crème Brulée" becomes "Creme Brulee").*/

/* Filnames containing non-ASCII characters (ex: files with è in them) cannot be stored in many cloud systems.*/
function encodeFileName(string = "Crème Brulée") {
  /* Remove any unicode characters in the source filename (ex: accented files) and replace
    /* them with an unaccented letter. */
  /* Return the string encoded as a URL.*/
  return encodeURIComponent(
    string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  );
}
