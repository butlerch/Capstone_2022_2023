# API Usage Notes:

TODO: complete (proper) readme instructions 


### Get Bottle Data (including techsheets)
/search
* This endpoint allows user to search the bottle_data table for multiple parameters
* If none are specified, everything in bottle_data is returned
* Functionality allows for params to be specified multiple times
    * Example: Looking for wine data from 2015 OR 2016
    * Usage: /search?year=2015&year=2016
* Can specify as many params as desired, do not need to specify all of them
* url params: bottleId, wineryName, soils, varietals, year
* values:

/random
* This endpoint returns a randomly selected bottle from the bottle_data table
* If no params are specified, only one bottle is returned
* There are no repeats (bottles can only be selected once per API call)
* NOTE: there are only 36 entries in the table now. If more are asked for, abort(404) is called
* url params: quantity
* values: integer

/techsheets/<int:id>
* This function returns a row of bottle data by bottle_id
* Is this one strictly necessary? It might not be needed unless front end wants to request data by specific (arbitrarily assigned) bottle_id

/bottleData?quantity={}
* This function returns specified number of bottle data entries in thebottle_data table
* url params: quantity
* values: "all", int

/bottleDataByWinery?wineryName={}
* This function returns all bottle data in the bottle_data table belonging to a specific winery
* url params: wineryName
* values: ["Alloro","Anne Amie","Archery Summit","Boedecker","Ken Writght Cellars","Minimus","Omero","Origin"]

/bottleDataBySoilType?soils={}
* This function returns all bottle data in the bottle_data table having to a specific soil type
* url params: soils
* values:

/bottleDataByYear?year={}
* This function returns all bottle data in the bottle_data table made in a specific year
* url params: year
* values: "2015" through "2019"

/bottleDataByVarietal?varietals={}
* This function returns all bottle data in the bottle_data table that contain a specific varietal
* url params: varietals
* values: ["Auxerrois","Baco Noir","Barbera","Black Muscat","Cab Sauvignon", "Cabernet Franc","Cabernet Sauvignon","Canadice","Canelli","Carmenere", "Chardonnay","Chenin Blanc","Cinsault","Counoise","Dolcetto","Gamay Beaujolais","Gamay Noir","Gew\u00fcrztraminer","Graciano","Grenache", "Gr\u00fcner Veltliner","Lemberger","Malbec","Marechal Foch","Marsanne", "Melon","Melon de Bourgogne","Merlot","Montepulciano","Morio Muskat", "Mourvedre","M\u00fcller-Thurgau","Muscadelle","Muscat","Muscat Canelli", "Muscat Ottonel","Nebbiolo","Orange Muscat","Petit Verdot","Petite Sirah", "Pinot Blanc","Pinot Gris","Pinot Meunier","Pinot Noir","Pinotage", "Primitivo","Riesling","Roussanne","Royalty","Sangiovese","Sauvignon Blanc","Semillon","Siegerrebe","Syrah","Tannat","Tempranillo","Touriga Nacional","Vermentino","Viognier","Zinfandel"]

Bottle data return object format:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;"aging_process":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"bottle_id":int,  
&nbsp;&nbsp;&nbsp;&nbsp;"cases_produced":int,  
&nbsp;&nbsp;&nbsp;&nbsp;"clones":["list","of","strings"],  
&nbsp;&nbsp;&nbsp;&nbsp;"clusters":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"pct_alcohol":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"ph":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"soils":["list","of","strings"],  
&nbsp;&nbsp;&nbsp;&nbsp;"source_file":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"ta":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"varietals":["list","of","strings"],   
&nbsp;&nbsp;&nbsp;&nbsp;"wine_name":["list","of","strings"],  
&nbsp;&nbsp;&nbsp;&nbsp;"winery_id":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"winery_name":"string",  
&nbsp;&nbsp;&nbsp;&nbsp;"year":"string"  
}  

If multiple objects are returned: objects are returned in a list []


### Other Endpoints
/varietalNames
* This function returns all varietal names found in the varietal_data table

/wineryInfo?wineryName={}
* This function returns winery data from the winery_data table belonging to a specific winery
* url params: wineryName
* values: ["Alloro","Anne Amie","Archery Summit","Boedecker","Ken Writght Cellars","Minimus","Omero","Origin"]

/listOfWineries
* This function returns all winery names found in the winery_data table
