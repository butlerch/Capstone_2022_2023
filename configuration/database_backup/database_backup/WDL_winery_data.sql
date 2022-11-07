/************************************************************
** AUTHOR:  Shara Orcutt
** DATE:    5/18/2022
** DESCRIPTION: The SQL commands below were built with 
**  postgreSQL types for the WDL- Senior project.
** -----------------------------
** DROP TABLE: may/may not cascade and drop sequence
** CREATE TABLE: Includes all customer columns
** INSERT into: A subset of test data for now.
************************************************************/

/*====  WINERY DATA =======================================*/
DROP TABLE IF EXISTS winery_data;

CREATE TABLE winery_data(winery_id serial PRIMARY KEY, winery_name varchar(255) NOT NULL, winemaker varchar(255), address varchar(255), phone_number varchar(30), winery_url varchar(255));

INSERT into winery_data(winery_id, winery_name, winemaker, address, phone_number, winery_url) VALUES 
    (nextval('winery_data_winery_id_seq'),'Alloro','Tom Fitzpatrick','22185 SW Lebeau Road, Sherwood, Oregon 97140','503.625.1978','https://www.allorovineyard.com/'),
    (nextval('winery_data_winery_id_seq'),'Anne Amie','GABRIELA SEPULVEDA VIGNES','6580 NE Mineral Springs Rd., Carlton, OR 9711','503.864.2991','https://anneamie.com/'),
    (nextval('winery_data_winery_id_seq'),'Archery Summit','Ian Burch','18599 NE Archery Summit RoadDayton, OR 97114','503.714.2030','https://www.archerysummit.com/'),
    (nextval('winery_data_winery_id_seq'),'Boedecker','Stewart Boedecker, Athena Pappas','2621 NW 30th Avenue, Portland, OR 97210','503.224.5778','https://boedeckercellars.com/'),
    (nextval('winery_data_winery_id_seq'),'Ken Writght Cellars','Ken & Karen Wright','236 N. Kutch St. Carlton, OR 97111','503-852-7070','https://kenwrightcellars.com/'),
    (nextval('winery_data_winery_id_seq'),'Minimus','NULL','116 W Main St. Catlgon, OR 97111','503.852.3033','https://www.craftwineco.com/'),
    (nextval('winery_data_winery_id_seq'),'Omero','NULL','117 W Main St. Catlgon, OR 97111','503.852.3034','https://www.craftwineco.com/'),
    (nextval('winery_data_winery_id_seq'),'Origin','NULL','118 W Main St. Catlgon, OR 97111','503.852.3035','https://www.craftwineco.com/');