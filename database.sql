-- MySQL dump 10.13  Distrib 8.0.25, for Win64 (x86_64)
--
-- Host: localhost    Database: bdapp
-- ------------------------------------------------------
-- Server version	8.0.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `districts`
--

DROP TABLE IF EXISTS `districts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `districts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `division_id` int NOT NULL,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `division_id` (`division_id`),
  CONSTRAINT `districts_ibfk_2` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,1,'Comilla'),(2,1,'Feni'),(3,1,'Brahmanbaria'),(4,1,'Rangamati'),(5,1,'Noakhali'),(6,1,'Chandpur'),(7,1,'Lakshmipur'),(8,1,'Chattogram'),(9,1,'Coxsbazar'),(10,1,'Khagrachhari'),(11,1,'Bandarban'),(12,2,'Sirajganj'),(13,2,'Pabna'),(14,2,'Bogura'),(15,2,'Rajshahi'),(16,2,'Natore'),(17,2,'Joypurhat'),(18,2,'Chapainawabganj'),(19,2,'Naogaon'),(20,3,'Jashore'),(21,3,'Satkhira'),(22,3,'Meherpur'),(23,3,'Narail'),(24,3,'Chuadanga'),(25,3,'Kushtia'),(26,3,'Magura'),(27,3,'Khulna'),(28,3,'Bagerhat'),(29,3,'Jhenaidah'),(30,4,'Jhalakathi'),(31,4,'Patuakhali'),(32,4,'Pirojpur'),(33,4,'Barisal'),(34,4,'Bhola'),(35,4,'Barguna'),(36,5,'Sylhet'),(37,5,'Moulvibazar'),(38,5,'Habiganj'),(39,5,'Sunamganj'),(40,6,'Narsingdi'),(41,6,'Gazipur'),(42,6,'Shariatpur'),(43,6,'Narayanganj'),(44,6,'Tangail'),(45,6,'Kishoreganj'),(46,6,'Manikganj'),(47,6,'Dhaka'),(48,6,'Munshiganj'),(49,6,'Rajbari'),(50,6,'Madaripur'),(51,6,'Gopalganj'),(52,6,'Faridpur'),(53,7,'Panchagarh'),(54,7,'Dinajpur'),(55,7,'Lalmonirhat'),(56,7,'Nilphamari'),(57,7,'Gaibandha'),(58,7,'Thakurgaon'),(59,7,'Rangpur'),(60,7,'Kurigram'),(61,8,'Sherpur'),(62,8,'Mymensingh'),(63,8,'Jamalpur'),(64,8,'Netrokona');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisions`
--

LOCK TABLES `divisions` WRITE;
/*!40000 ALTER TABLE `divisions` DISABLE KEYS */;
INSERT INTO `divisions` VALUES (1,'Chattagram'),(2,'Rajshahi'),(3,'Khulna'),(4,'Barisal'),(5,'Sylhet'),(6,'Dhaka'),(7,'Rangpur'),(8,'Mymensingh');
/*!40000 ALTER TABLE `divisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nid`
--

DROP TABLE IF EXISTS `nid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nid` (
  `id` int NOT NULL,
  `front` varchar(250) NOT NULL,
  `back` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nid`
--

LOCK TABLES `nid` WRITE;
/*!40000 ALTER TABLE `nid` DISABLE KEYS */;
INSERT INTO `nid` VALUES (1,'7b5062332afdd704afd199fb8817273ae0f9c203fe0b9b90abeb33f0eb8b6701a03c8f95f32e2fdfa2bd8b175d1e0b25052c35832ab7ab7b6213914014f625f3ad526239239aff52c72ac358451e986737233a209d62ce1ed4bb73d043e4cf01be.png','3cf201c0de80177f1115005cdad24e287f38e038b1678a43d37e277acffd1c2e146b5261b5fd5ead2382be893108a30de61cdef4257e04bab618d66f7f7900360f54e03a21049c3f131445b49a5724b885e5d344ebadf50a03b7891f1694a7f62b.png');
/*!40000 ALTER TABLE `nid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upazillas`
--

DROP TABLE IF EXISTS `upazillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upazillas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `district_id` int NOT NULL,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `district_id` (`district_id`),
  CONSTRAINT `upazillas_ibfk_2` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=492 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upazillas`
--

LOCK TABLES `upazillas` WRITE;
/*!40000 ALTER TABLE `upazillas` DISABLE KEYS */;
INSERT INTO `upazillas` VALUES (1,1,'Debidwar'),(2,1,'Barura'),(3,1,'Brahmanpara'),(4,1,'Chandina'),(5,1,'Chauddagram'),(6,1,'Daudkandi'),(7,1,'Homna'),(8,1,'Laksam'),(9,1,'Muradnagar'),(10,1,'Nangalkot'),(11,1,'Comilla Sadar'),(12,1,'Meghna'),(13,1,'Monohargonj'),(14,1,'Sadarsouth'),(15,1,'Titas'),(16,1,'Burichang'),(17,1,'Lalmai'),(18,2,'Chhagalnaiya'),(19,2,'Feni Sadar'),(20,2,'Sonagazi'),(21,2,'Fulgazi'),(22,2,'Parshuram'),(23,2,'Daganbhuiyan'),(24,3,'Brahmanbaria Sadar'),(25,3,'Kasba'),(26,3,'Nasirnagar'),(27,3,'Sarail'),(28,3,'Ashuganj'),(29,3,'Akhaura'),(30,3,'Nabinagar'),(31,3,'Bancharampur'),(32,3,'Bijoynagar'),(33,4,'Rangamati Sadar'),(34,4,'Kaptai'),(35,4,'Kawkhali'),(36,4,'Baghaichari'),(37,4,'Barkal'),(38,4,'Langadu'),(39,4,'Rajasthali'),(40,4,'Belaichari'),(41,4,'Juraichari'),(42,4,'Naniarchar'),(43,5,'Noakhali Sadar'),(44,5,'Companiganj'),(45,5,'Begumganj'),(46,5,'Hatia'),(47,5,'Subarnachar'),(48,5,'Kabirhat'),(49,5,'Senbug'),(50,5,'Chatkhil'),(51,5,'Sonaimori'),(52,6,'Haimchar'),(53,6,'Kachua'),(54,6,'Shahrasti'),(55,6,'Chandpur Sadar'),(56,6,'Matlab South'),(57,6,'Hajiganj'),(58,6,'Matlab North'),(59,6,'Faridgonj'),(60,7,'Lakshmipur Sadar'),(61,7,'Kamalnagar'),(62,7,'Raipur'),(63,7,'Ramgati'),(64,7,'Ramganj'),(65,8,'Rangunia'),(66,8,'Sitakunda'),(67,8,'Mirsharai'),(68,8,'Patiya'),(69,8,'Sandwip'),(70,8,'Banshkhali'),(71,8,'Boalkhali'),(72,8,'Anwara'),(73,8,'Chandanaish'),(74,8,'Satkania'),(75,8,'Lohagara'),(76,8,'Hathazari'),(77,8,'Fatikchhari'),(78,8,'Raozan'),(79,8,'Karnafuli'),(80,9,'Coxsbazar Sadar'),(81,9,'Chakaria'),(82,9,'Kutubdia'),(83,9,'Ukhiya'),(84,9,'Moheshkhali'),(85,9,'Pekua'),(86,9,'Ramu'),(87,9,'Teknaf'),(88,10,'Khagrachhari Sadar'),(89,10,'Dighinala'),(90,10,'Panchari'),(91,10,'Laxmichhari'),(92,10,'Mohalchari'),(93,10,'Manikchari'),(94,10,'Ramgarh'),(95,10,'Matiranga'),(96,10,'Guimara'),(97,11,'Bandarban Sadar'),(98,11,'Alikadam'),(99,11,'Naikhongchhari'),(100,11,'Rowangchhari'),(101,11,'Lama'),(102,11,'Ruma'),(103,11,'Thanchi'),(104,12,'Belkuchi'),(105,12,'Chauhali'),(106,12,'Kamarkhand'),(107,12,'Kazipur'),(108,12,'Raigonj'),(109,12,'Shahjadpur'),(110,12,'Sirajganj Sadar'),(111,12,'Tarash'),(112,12,'Ullapara'),(113,13,'Sujanagar'),(114,13,'Ishurdi'),(115,13,'Bhangura'),(116,13,'Pabna Sadar'),(117,13,'Bera'),(118,13,'Atghoria'),(119,13,'Chatmohar'),(120,13,'Santhia'),(121,13,'Faridpur'),(122,14,'Kahaloo'),(123,14,'Bogra Sadar'),(124,14,'Shariakandi'),(125,14,'Shajahanpur'),(126,14,'Dupchanchia'),(127,14,'Adamdighi'),(128,14,'Nondigram'),(129,14,'Sonatala'),(130,14,'Dhunot'),(131,14,'Gabtali'),(132,14,'Sherpur'),(133,14,'Shibganj'),(134,15,'Paba'),(135,15,'Durgapur'),(136,15,'Mohonpur'),(137,15,'Charghat'),(138,15,'Puthia'),(139,15,'Bagha'),(140,15,'Godagari'),(141,15,'Tanore'),(142,15,'Bagmara'),(143,16,'Natore Sadar'),(144,16,'Singra'),(145,16,'Baraigram'),(146,16,'Bagatipara'),(147,16,'Lalpur'),(148,16,'Gurudaspur'),(149,16,'Naldanga'),(150,17,'Akkelpur'),(151,17,'Kalai'),(152,17,'Khetlal'),(153,17,'Panchbibi'),(154,17,'Joypurhat Sadar'),(155,18,'Chapainawabganj Sadar'),(156,18,'Gomostapur'),(157,18,'Nachol'),(158,18,'Bholahat'),(159,18,'Shibganj'),(160,19,'Mohadevpur'),(161,19,'Badalgachi'),(162,19,'Patnitala'),(163,19,'Dhamoirhat'),(164,19,'Niamatpur'),(165,19,'Manda'),(166,19,'Atrai'),(167,19,'Raninagar'),(168,19,'Naogaon Sadar'),(169,19,'Porsha'),(170,19,'Sapahar'),(171,20,'Manirampur'),(172,20,'Abhaynagar'),(173,20,'Bagherpara'),(174,20,'Chougachha'),(175,20,'Jhikargacha'),(176,20,'Keshabpur'),(177,20,'Jessore Sadar'),(178,20,'Sharsha'),(179,21,'Assasuni'),(180,21,'Debhata'),(181,21,'Kalaroa'),(182,21,'Satkhira Sadar'),(183,21,'Shyamnagar'),(184,21,'Tala'),(185,21,'Kaliganj'),(186,22,'Mujibnagar'),(187,22,'Meherpur Sadar'),(188,22,'Gangni'),(189,23,'Narail Sadar'),(190,23,'Lohagara'),(191,23,'Kalia'),(192,24,'Chuadanga Sadar'),(193,24,'Alamdanga'),(194,24,'Damurhuda'),(195,24,'Jibannagar'),(196,25,'Kushtia Sadar'),(197,25,'Kumarkhali'),(198,25,'Khoksa'),(199,25,'Mirpur'),(200,25,'Daulatpur'),(201,25,'Bheramara'),(202,26,'Shalikha'),(203,26,'Sreepur'),(204,26,'Magura Sadar'),(205,26,'Mohammadpur'),(206,27,'Paikgasa'),(207,27,'Fultola'),(208,27,'Digholia'),(209,27,'Rupsha'),(210,27,'Terokhada'),(211,27,'Dumuria'),(212,27,'Botiaghata'),(213,27,'Dakop'),(214,27,'Koyra'),(215,28,'Fakirhat'),(216,28,'Bagerhat Sadar'),(217,28,'Mollahat'),(218,28,'Sarankhola'),(219,28,'Rampal'),(220,28,'Morrelganj'),(221,28,'Kachua'),(222,28,'Mongla'),(223,28,'Chitalmari'),(224,29,'Jhenaidah Sadar'),(225,29,'Shailkupa'),(226,29,'Harinakundu'),(227,29,'Kaliganj'),(228,29,'Kotchandpur'),(229,29,'Moheshpur'),(230,30,'Jhalakathi Sadar'),(231,30,'Kathalia'),(232,30,'Nalchity'),(233,30,'Rajapur'),(234,31,'Bauphal'),(235,31,'Patuakhali Sadar'),(236,31,'Dumki'),(237,31,'Dashmina'),(238,31,'Kalapara'),(239,31,'Mirzaganj'),(240,31,'Galachipa'),(241,31,'Rangabali'),(242,32,'Pirojpur Sadar'),(243,32,'Nazirpur'),(244,32,'Kawkhali'),(245,32,'Zianagar'),(246,32,'Bhandaria'),(247,32,'Mathbaria'),(248,32,'Nesarabad'),(249,33,'Barisal Sadar'),(250,33,'Bakerganj'),(251,33,'Babuganj'),(252,33,'Wazirpur'),(253,33,'Banaripara'),(254,33,'Gournadi'),(255,33,'Agailjhara'),(256,33,'Mehendiganj'),(257,33,'Muladi'),(258,33,'Hizla'),(259,34,'Bhola Sadar'),(260,34,'Borhan Sddin'),(261,34,'Charfesson'),(262,34,'Doulatkhan'),(263,34,'Monpura'),(264,34,'Tazumuddin'),(265,34,'Lalmohan'),(266,35,'Amtali'),(267,35,'Barguna Sadar'),(268,35,'Betagi'),(269,35,'Bamna'),(270,35,'Pathorghata'),(271,35,'Taltali'),(272,36,'Balaganj'),(273,36,'Beanibazar'),(274,36,'Bishwanath'),(275,36,'Companiganj'),(276,36,'Fenchuganj'),(277,36,'Golapganj'),(278,36,'Gowainghat'),(279,36,'Jaintiapur'),(280,36,'Kanaighat'),(281,36,'Sylhet Sadar'),(282,36,'Zakiganj'),(283,36,'Dakshinsurma'),(284,36,'Osmaninagar'),(285,37,'Barlekha'),(286,37,'Kamolganj'),(287,37,'Kulaura'),(288,37,'Moulvibazar Sadar'),(289,37,'Rajnagar'),(290,37,'Sreemangal'),(291,37,'Juri'),(292,38,'Nabiganj'),(293,38,'Bahubal'),(294,38,'Ajmiriganj'),(295,38,'Baniachong'),(296,38,'Lakhai'),(297,38,'Chunarughat'),(298,38,'Habiganj Sadar'),(299,38,'Madhabpur'),(300,39,'Sunamganj Sadar'),(301,39,'South Sunamganj'),(302,39,'Bishwambarpur'),(303,39,'Chhatak'),(304,39,'Jagannathpur'),(305,39,'Dowarabazar'),(306,39,'Tahirpur'),(307,39,'Dharmapasha'),(308,39,'Jamalganj'),(309,39,'Shalla'),(310,39,'Derai'),(311,40,'Belabo'),(312,40,'Monohardi'),(313,40,'Narsingdi Sadar'),(314,40,'Palash'),(315,40,'Raipura'),(316,40,'Shibpur'),(317,41,'Kaliganj'),(318,41,'Kaliakair'),(319,41,'Kapasia'),(320,41,'Gazipur Sadar'),(321,41,'Sreepur'),(322,42,'Shariatpur Sadar'),(323,42,'Naria'),(324,42,'Zajira'),(325,42,'Gosairhat'),(326,42,'Bhedarganj'),(327,42,'Damudya'),(328,43,'Araihazar'),(329,43,'Bandar'),(330,43,'Narayanganj Sadar'),(331,43,'Rupganj'),(332,43,'Sonargaon'),(333,44,'Basail'),(334,44,'Bhuapur'),(335,44,'Delduar'),(336,44,'Ghatail'),(337,44,'Gopalpur'),(338,44,'Madhupur'),(339,44,'Mirzapur'),(340,44,'Nagarpur'),(341,44,'Sakhipur'),(342,44,'Tangail Sadar'),(343,44,'Kalihati'),(344,44,'Dhanbari'),(345,45,'Itna'),(346,45,'Katiadi'),(347,45,'Bhairab'),(348,45,'Tarail'),(349,45,'Hossainpur'),(350,45,'Pakundia'),(351,45,'Kuliarchar'),(352,45,'Kishoreganj Sadar'),(353,45,'Karimgonj'),(354,45,'Bajitpur'),(355,45,'Austagram'),(356,45,'Mithamoin'),(357,45,'Nikli'),(358,46,'Harirampur'),(359,46,'Saturia'),(360,46,'Manikganj Sadar'),(361,46,'Gior'),(362,46,'Shibaloy'),(363,46,'Doulatpur'),(364,46,'Singiar'),(365,47,'Savar'),(366,47,'Dhamrai'),(367,47,'Keraniganj'),(368,47,'Nawabganj'),(369,47,'Dohar'),(370,48,'Munshiganj Sadar'),(371,48,'Sreenagar'),(372,48,'Sirajdikhan'),(373,48,'Louhajanj'),(374,48,'Gajaria'),(375,48,'Tongibari'),(376,49,'Rajbari Sadar'),(377,49,'Goalanda'),(378,49,'Pangsa'),(379,49,'Baliakandi'),(380,49,'Kalukhali'),(381,50,'Madaripur Sadar'),(382,50,'Shibchar'),(383,50,'Kalkini'),(384,50,'Rajoir'),(385,51,'Gopalganj Sadar'),(386,51,'Kashiani'),(387,51,'Tungipara'),(388,51,'Kotalipara'),(389,51,'Muksudpur'),(390,52,'Faridpur Sadar'),(391,52,'Alfadanga'),(392,52,'Boalmari'),(393,52,'Sadarpur'),(394,52,'Nagarkanda'),(395,52,'Bhanga'),(396,52,'Charbhadrasan'),(397,52,'Madhukhali'),(398,52,'Saltha'),(399,53,'Panchagarh Sadar'),(400,53,'Debiganj'),(401,53,'Boda'),(402,53,'Atwari'),(403,53,'Tetulia'),(404,54,'Nawabganj'),(405,54,'Birganj'),(406,54,'Ghoraghat'),(407,54,'Birampur'),(408,54,'Parbatipur'),(409,54,'Bochaganj'),(410,54,'Kaharol'),(411,54,'Fulbari'),(412,54,'Dinajpur Sadar'),(413,54,'Hakimpur'),(414,54,'Khansama'),(415,54,'Birol'),(416,54,'Chirirbandar'),(417,55,'Lalmonirhat Sadar'),(418,55,'Kaliganj'),(419,55,'Hatibandha'),(420,55,'Patgram'),(421,55,'Aditmari'),(422,56,'Syedpur'),(423,56,'Domar'),(424,56,'Dimla'),(425,56,'Jaldhaka'),(426,56,'Kishorganj'),(427,56,'Nilphamari Sadar'),(428,57,'Sadullapur'),(429,57,'Gaibandha Sadar'),(430,57,'Palashbari'),(431,57,'Saghata'),(432,57,'Gobindaganj'),(433,57,'Sundarganj'),(434,57,'Phulchari'),(435,58,'Thakurgaon Sadar'),(436,58,'Pirganj'),(437,58,'Ranisankail'),(438,58,'Haripur'),(439,58,'Baliadangi'),(440,59,'Rangpur Sadar'),(441,59,'Gangachara'),(442,59,'Taragonj'),(443,59,'Badargonj'),(444,59,'Mithapukur'),(445,59,'Pirgonj'),(446,59,'Kaunia'),(447,59,'Pirgacha'),(448,60,'Kurigram Sadar'),(449,60,'Nageshwari'),(450,60,'Bhurungamari'),(451,60,'Phulbari'),(452,60,'Rajarhat'),(453,60,'Ulipur'),(454,60,'Chilmari'),(455,60,'Rowmari'),(456,60,'Charrajibpur'),(457,61,'Sherpur Sadar'),(458,61,'Nalitabari'),(459,61,'Sreebordi'),(460,61,'Nokla'),(461,61,'Jhenaigati'),(462,62,'Fulbaria'),(463,62,'Trishal'),(464,62,'Bhaluka'),(465,62,'Muktagacha'),(466,62,'Mymensingh Sadar'),(467,62,'Dhobaura'),(468,62,'Phulpur'),(469,62,'Haluaghat'),(470,62,'Gouripur'),(471,62,'Gafargaon'),(472,62,'Iswarganj'),(473,62,'Nandail'),(474,62,'Tarakanda'),(475,63,'Jamalpur Sadar'),(476,63,'Melandah'),(477,63,'Islampur'),(478,63,'Dewangonj'),(479,63,'Sarishabari'),(480,63,'Madarganj'),(481,63,'Bokshiganj'),(482,64,'Barhatta'),(483,64,'Durgapur'),(484,64,'Kendua'),(485,64,'Atpara'),(486,64,'Madan'),(487,64,'Khaliajuri'),(488,64,'Kalmakanda'),(489,64,'Mohongonj'),(490,64,'Purbadhala'),(491,64,'Netrokona Sadar');
/*!40000 ALTER TABLE `upazillas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(250) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `email_verified` enum('yes','no') NOT NULL DEFAULT 'no',
  `profile_build` enum('yes','no') NOT NULL DEFAULT 'no',
  `nid_verified` enum('yes','no') NOT NULL DEFAULT 'no',
  `joined` date NOT NULL,
  `provider` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Minhaz','Kamal','minhaz.kamal9900@gmail.com',NULL,'yes','no','no','2021-07-30','google'),(2,'MINHAZ','KAMAL','minhazkamal@iut-dhaka.edu','$2a$10$d25V0RIEsgP0ZgaMSXdojOkiDxi0tmQUzpXzZSyaRNAcgqaa8y3Bu','yes','no','no','2021-07-31','self'),(4,'Notredamian','Minhaz','ndcminhaz@gmail.com',NULL,'yes','no','no','2021-08-04','google');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-04  4:39:02
