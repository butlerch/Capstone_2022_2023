/************************************************************
** AUTHOR:  Shara Orcutt
** DATE:    5/20/2022
** DESCRIPTION: The SQL scripts below were built with 
**  postgreSQL types for the WDL- Senior project. Terminology
** list is for reference for possible "other data" key_Strings
** -----------------------------
** CREATE TABLE: Creates the terminology table
** INSERT into: List of terminology from interwebs
************************************************************/
DROP TABLE IF EXISTS varietal_data;

CREATE TABLE varietal_data(varietal_id serial PRIMARY KEY, varietal_name varchar(255));

INSERT into varietal_data(varietal_id, varietal_name) VALUES
	(nextval('varietal_data_varietal_id_seq'),'Auxerrois'),
	(nextval('varietal_data_varietal_id_seq'),'Baco Noir'),
	(nextval('varietal_data_varietal_id_seq'),'Barbera'),
	(nextval('varietal_data_varietal_id_seq'),'Black Muscat'),
	(nextval('varietal_data_varietal_id_seq'),'Cab Sauvignon'),
	(nextval('varietal_data_varietal_id_seq'),'Cabernet Franc'),
	(nextval('varietal_data_varietal_id_seq'),'Cabernet Sauvignon'),
	(nextval('varietal_data_varietal_id_seq'),'Canadice'),
	(nextval('varietal_data_varietal_id_seq'),'Canelli'),
	(nextval('varietal_data_varietal_id_seq'),'Carmenere'),
	(nextval('varietal_data_varietal_id_seq'),'Chardonnay'),
	(nextval('varietal_data_varietal_id_seq'),'Chenin Blanc'),
	(nextval('varietal_data_varietal_id_seq'),'Cinsault'),
	(nextval('varietal_data_varietal_id_seq'),'Counoise'),
	(nextval('varietal_data_varietal_id_seq'),'Dolcetto'),
	(nextval('varietal_data_varietal_id_seq'),'Gamay Beaujolais'),
	(nextval('varietal_data_varietal_id_seq'),'Gamay Noir'),
	(nextval('varietal_data_varietal_id_seq'),'Gewürztraminer'),
	(nextval('varietal_data_varietal_id_seq'),'Graciano'),
	(nextval('varietal_data_varietal_id_seq'),'Grenache'),
	(nextval('varietal_data_varietal_id_seq'),'Grüner Veltliner'),
	(nextval('varietal_data_varietal_id_seq'),'Lemberger'),
	(nextval('varietal_data_varietal_id_seq'),'Malbec'),
	(nextval('varietal_data_varietal_id_seq'),'Marechal Foch'),
	(nextval('varietal_data_varietal_id_seq'),'Marsanne'),
	(nextval('varietal_data_varietal_id_seq'),'Melon'),
	(nextval('varietal_data_varietal_id_seq'),'Melon de Bourgogne'),
	(nextval('varietal_data_varietal_id_seq'),'Merlot'),
	(nextval('varietal_data_varietal_id_seq'),'Montepulciano'),
	(nextval('varietal_data_varietal_id_seq'),'Morio Muskat'),
	(nextval('varietal_data_varietal_id_seq'),'Mourvedre'),
	(nextval('varietal_data_varietal_id_seq'),'Müller-Thurgau'),
	(nextval('varietal_data_varietal_id_seq'),'Muscadelle'),
	(nextval('varietal_data_varietal_id_seq'),'Muscat'),
	(nextval('varietal_data_varietal_id_seq'),'Muscat Canelli'),
	(nextval('varietal_data_varietal_id_seq'),'Muscat Ottonel'),
	(nextval('varietal_data_varietal_id_seq'),'Nebbiolo'),
	(nextval('varietal_data_varietal_id_seq'),'Orange Muscat'),
	(nextval('varietal_data_varietal_id_seq'),'Petit Verdot'),
	(nextval('varietal_data_varietal_id_seq'),'Petite Sirah'),
	(nextval('varietal_data_varietal_id_seq'),'Pinot Blanc'),
	(nextval('varietal_data_varietal_id_seq'),'Pinot Gris'),
	(nextval('varietal_data_varietal_id_seq'),'Pinot Meunier'),
	(nextval('varietal_data_varietal_id_seq'),'Pinot Noir'),
	(nextval('varietal_data_varietal_id_seq'),'Pinotage'),
	(nextval('varietal_data_varietal_id_seq'),'Primitivo'),
	(nextval('varietal_data_varietal_id_seq'),'Riesling'),
	(nextval('varietal_data_varietal_id_seq'),'Roussanne'),
	(nextval('varietal_data_varietal_id_seq'),'Royalty'),
	(nextval('varietal_data_varietal_id_seq'),'Sangiovese'),
	(nextval('varietal_data_varietal_id_seq'),'Sauvignon Blanc'),
	(nextval('varietal_data_varietal_id_seq'),'Semillon'),
	(nextval('varietal_data_varietal_id_seq'),'Siegerrebe'),
	(nextval('varietal_data_varietal_id_seq'),'Syrah'),
	(nextval('varietal_data_varietal_id_seq'),'Tannat'),
	(nextval('varietal_data_varietal_id_seq'),'Tempranillo'),
	(nextval('varietal_data_varietal_id_seq'),'Touriga Nacional'),
	(nextval('varietal_data_varietal_id_seq'),'Vermentino'),
	(nextval('varietal_data_varietal_id_seq'),'Viognier'),
	(nextval('varietal_data_varietal_id_seq'),'Zinfandel');