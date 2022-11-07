/************************************************************
** AUTHOR:  Shara Orcutt
** DATE:    5/30/2022
** DESCRIPTION: The SQL commands below were built with 
**  postgreSQL types for the WDL- Senior project.
** -----------------------------
** DROP TABLE: may/may not cascade and drop sequence
** CREATE TABLE: Includes all customer columns
** INSERT into: A subset of test data for now.
************************************************************/

/*====  WINERY DATA =======================================*/
DROP TABLE IF EXISTS bottle_data;

CREATE TABLE bottle_data(
	bottle_id serial PRIMARY KEY, 
    winery_name varchar(255), 
    winery_id varchar(30), 
    year_test varchar(6) NOT NULL, 
    wine_name varchar(255), 
    pct_alcohol varchar(10), 
    ta varchar(10), 
    ph varchar(10), 
    soils varchar(255), 
    varietals varchar(255), 
    clusters varchar(10), 
	aging_process varchar(255), 
    cases_produced integer, 
    source_file varchar(255), 
    run_date date
    );

INSERT into bottle_data(bottle_id, winery_name, winery_id, year_test, wine_name, pct_alcohol, ta, ph, soils, varietals, clones, clusters, aging_process, cases_produced, source_file) VALUES
	(nextval('bottle_data_bottle_id_seq'), 'Origin', 'W-8', '2015', 'Pinot Noir', '13.0% ', 'NULL', 'NULL', 'NULL', 'Sedimentary ', '943 ', '70% ', 'New & neutral French oak ', '99 ', '15_origin_johan.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Origin', 'W-8', '2016', 'Chenin Blanc', '13.2% ', '5.7 g/L ', '3.62 ', 'NULL', 'Sedimentary ', 'NULL', 'NULL', 'Neutral French oak ', '49 ', '16+Chenin+Blanc+Tech.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2016', 'Gamay Noir', '13.9% ', '7.3 g/L ', '3.40 ', 'NULL', 'Sedimentary ', 'Oregon Heirloom ', '10% ', '10 months neutral French oak barriques ', '450 ', '16+Gamay+Noir.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Cabernet Franc, Gamay Noir', '12.7% ', '5.8g/L ', '3.69 ', 'NULL', 'Sedimentary ', 'NULL', '75% ', 'neutral french oak ', '60 ', '16+Minimus+WV+Red.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2016', 'Chardonnay', '13% ', '5.9 g/L ', '3.32 ', 'NULL', 'Marine-Sedimentary, Alluvial, Volcanic, ', 'Mendoza, 108, Musqué, Old Wente, Espiquette ', 'NULL', '10 months in combination of 140L Chablis casks, half barrels and neutral French barrique ', '390 ', '16+Omero+Chard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2016', 'Gamay Noir', '13.9% ', '7.3 g/L ', '3.40 ', 'NULL', 'Sedimentary ', 'Oregon Heirloom ', '10% ', '10 months neutral French oak barriques ', '450 ', '16GamayNoir.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Pinot Noir', '12.8% ', '6.0 g/L ', '3.62 ', 'NULL', 'NULL', 'Mariafeld, 943 ', '80% ', 'neutral French oak ', '149 ', '16_dict_johan_PN+.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Chardonnay', '13.2% ', '5.4 g/L ', '3.36 ', 'NULL', 'Sedimentary ', 'Mendoza ', 'NULL', 'neutral French oak ', '25 ', '16_no_Mother#24.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'NULL', '13.89% ', '6.3 g/L ', '3.48 ', 'Pinot Noir, Gamay Noir and Trousseau Noir ', 'NULL', 'NULL', '40% ', 'neutral French oak barriques ', '70 ', '16_no_Noir#23+.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Pinot Noir', '13.9% ', '5.0 g/L ', '3.45 ', 'Pinot Blanc, Pinot Gris, Pinot Noir, Pinot “Gouges,” Pinot Meunier ', 'NULL', 'NULL', 'NULL', 'Chestnut barriques, stainless steel ', '98 ', '16_no_Pinot#22+.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Origin', 'W-8', '2016', 'Pinot Noir', '13.69% ', '4.6 g/L ', '3.69 ', 'NULL', 'Sedimentary ', 'NULL', 'NULL', 'neutral French oak ', '45 ', '16_origin_gouges.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Sauvignon Blanc', '14.8% ', 'NULL', '3.47 ', 'NULL', 'NULL', 'NULL', 'NULL', 'Combination Amphorae & Acacia wood casks ', '150 ', '17+Amphorae+SB.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Chardonnay', '14.9% ', 'NULL', '3.69 ', 'NULL', 'sedimentary ', 'NULL', 'NULL', 'neutral oak & new chestnut barriques ', '120 ', '17+Min+#25.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Chardonnay, Pinot Noir', '13.0% ', 'NULL', '3.51 ', 'NULL', 'varied ', 'NULL', '20% ', 'nuetral French oak ', '310 ', '17+MIn+WV+Red+Wine.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Müller-Thurgau, Riesling', '12.5% ', 'NULL', 'NULL', 'NULL', 'Volcanic ', 'NULL', 'NULL', 'Acacia wood & stainless steel ', '110 ', '17+muller+thurgau+tech.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2017', 'Chardonnay', '13.4% ', 'NULL', '3.6 ', 'NULL', 'Varied ', 'Old Wenté, Calera, Musquet, Mount Eden, 108 ', 'NULL', 'neutral French oak barriques, half barrels and 140L Chablis casks ', '200 ', '17+Omero+Chard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2017', 'Gamay Noir', '13.5% ', 'NULL', '3.34 ', 'NULL', 'volcanic ', 'NULL', '10% ', 'Neutral oak ', '460 ', '17+Omero+Gamay.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Origin', 'W-8', '2017', 'Cabernet Franc', '13.6% ', 'NULL', '3.43 ', 'NULL', 'basalt ', 'NULL', 'NULL', 'neutral French oak ', '75 ', '17+Origin+Cab+Franc.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Origin', 'W-8', '2017', 'Chardonnay, Sauvignon Blanc', '13.3% ', 'NULL', 'NULL', '55% Sauvignon Blanc, 45% Chardonnay ', 'Sedimentary ', 'NULL', 'NULL', 'neutral oak ', '150 ', '17+Origin+SB+Chard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'NULL', '13.7% ', 'NULL', 'NULL', 'NULL', 'Varied ', 'NULL', 'NULL', '9 mnths in combination neutral oak, Acacia wood, Chestnut barriques & puncheons ', '110 ', '17+Rockwell.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Pinot Noir', '13.1% ', 'NULL', 'NULL', 'NULL', 'Varied ', 'NULL', '30% ', 'Concrete ', '883 ', '17+Sans-soufre+PN.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Vermentino', '13.7% ', 'NULL', '3.41 ', 'NULL', 'Volcanic ', 'NULL', 'NULL', 'Combination concrete and neutral oak/chestnut ', '210 ', '17+Vermentino+Tech.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Chardonnay', '14.1% ', 'NULL', '3.31 ', 'NULL', 'basalt ', 'NULL', 'NULL', 'neutral French oak ', '80 ', '17Mendoza+Chard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2017', 'Chardonnay', '13.6% ', 'NULL', '3.38 ', 'NULL', 'sedimentary ', 'NULL', 'NULL', 'combination neutral & new French oak ', '30 ', '17MInCaleraChard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2018', 'Cabernet Franc, Pinot Gris, Pinot Noir', '13.9% ', 'NULL', '3.45 ', 'NULL', 'NULL', 'NULL', '15% ', '10 months in neutral oak barriques & puncheons ', '400 ', '18WV+Red.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2018', 'Grenache, Syrah', '13.8% ', 'NULL', '3.42 ', '78% Grenache, 24% Syrah ', 'NULL', 'NULL', '20% ', '22 months in neutral French oak barriques ', '95 ', '18_dict_Gre-Syrah.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2018', 'Syrah', '13.9% ', 'NULL', '3.65 ', '100% Syrah ', 'Alluvial ', 'NULL', '90% ', '16 months in neutral French oak barriques ', '100 ', '18_MIN_SM3.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Pinot Noir', '12.7% ', '5.8g/L ', '3.64 ', 'NULL', 'Sedimentary ', 'unknown ', '25% ', 'neutral french oak ', '50 ', '1968+PN+Chehalem.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Chardonnay', '12.9% ', 'NULL', 'NULL', 'NULL', 'Sedimentary ', '108 ', 'NULL', 'second-filled french oak ', '14 ', '1984+Chard.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2019', 'Chardonnay, Sauvignon Blanc', '12.2% ', 'NULL', '3.35 ', '69% Chardonnay, 31% Sauvignon blanc ', 'NULL', 'NULL', 'NULL', '16 months in neutral French oak ', '70 cases ', '19_Helix_Caroline.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Omero', 'W-7', '2019', 'Pinot Gris', '12.9% ', 'NULL', '3.29 ', '100% Pinot Gris ', 'NULL', 'NULL', 'NULL', '7 months in neutral French oak barriques ', '140 ', '19_Omero_PG.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Alloro', 'W-1', '2017', 'Pinot Noir', ' 14.3% ', ' 6.10 g/L ', ' 3.61 ', 'NULL', 'Laurelwood Series ', '35% Pommard, 37% - 777, 23% - 114, 5% - Wadenswil ', 'NULL', 'NULL', '1,700 cases ', 'AlloroEPN17 TechSheet.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Alloro', 'W-1', '2017', 'Pinot Noir', ' 14.2% ', ' 6.20 g/L ', ' 3.62 ', 'NULL', 'Laurelwood Series ', '100% - Dijon 777 ', 'NULL', 'NULL', '300 cases ', 'AlloroJusPN17 TechSheet.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Alloro', 'W-1', '2017', 'Riesling', ' 12.0% ', ' 8.50 g/L ', ' 2.92 ', 'NULL', 'Laurelwood Series ', 'NULL', 'NULL', 'NULL', '100 cases ', 'AlloroRies17TechSheet.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2018', 'NULL', '12% ', 'NULL', '3.20 ', '100% Blaufränkisch ', 'Sedimentary ', 'NULL', 'NULL', 'NULL', '90 ', 'NV_dict_Blau_PétNat.json'),
	(nextval('bottle_data_bottle_id_seq'), 'Minimus', 'W-6', '2016', 'Chardonnay', '13.3% ', 'NULL', '3.42 ', '100% Chardonnay ', 'NULL', 'Old Wente, Espiguette ', 'NULL', '15 months to 3 years in 2nd fill and neutral French oak barriques ', '50 ', 'NV_Helix_Chardonnay.json');
