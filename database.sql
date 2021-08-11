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
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `division_id` int unsigned NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `districts`
--

LOCK TABLES `districts` WRITE;
/*!40000 ALTER TABLE `districts` DISABLE KEYS */;
INSERT INTO `districts` VALUES (1,3,'Dhaka'),(2,3,'Faridpur'),(3,3,'Gazipur'),(4,3,'Gopalganj'),(5,8,'Jamalpur'),(6,3,'Kishoreganj'),(7,3,'Madaripur'),(8,3,'Manikganj'),(9,3,'Munshiganj'),(10,8,'Mymensingh'),(11,3,'Narayanganj'),(12,3,'Narsingdi'),(13,8,'Netrokona'),(14,3,'Rajbari'),(15,3,'Shariatpur'),(16,8,'Sherpur'),(17,3,'Tangail'),(18,5,'Bogra'),(19,5,'Joypurhat'),(20,5,'Naogaon'),(21,5,'Natore'),(22,5,'Nawabganj'),(23,5,'Pabna'),(24,5,'Rajshahi'),(25,5,'Sirajgonj'),(26,6,'Dinajpur'),(27,6,'Gaibandha'),(28,6,'Kurigram'),(29,6,'Lalmonirhat'),(30,6,'Nilphamari'),(31,6,'Panchagarh'),(32,6,'Rangpur'),(33,6,'Thakurgaon'),(34,1,'Barguna'),(35,1,'Barisal'),(36,1,'Bhola'),(37,1,'Jhalokati'),(38,1,'Patuakhali'),(39,1,'Pirojpur'),(40,2,'Bandarban'),(41,2,'Brahmanbaria'),(42,2,'Chandpur'),(43,2,'Chittagong'),(44,2,'Comilla'),(45,2,'Cox\'s Bazar'),(46,2,'Feni'),(47,2,'Khagrachari'),(48,2,'Lakshmipur'),(49,2,'Noakhali'),(50,2,'Rangamati'),(51,7,'Habiganj'),(52,7,'Maulvibazar'),(53,7,'Sunamganj'),(54,7,'Sylhet'),(55,4,'Bagerhat'),(56,4,'Chuadanga'),(57,4,'Jessore'),(58,4,'Jhenaidah'),(59,4,'Khulna'),(60,4,'Kushtia'),(61,4,'Magura'),(62,4,'Meherpur'),(63,4,'Narail'),(64,4,'Satkhira');
/*!40000 ALTER TABLE `districts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `divisions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisions`
--

LOCK TABLES `divisions` WRITE;
/*!40000 ALTER TABLE `divisions` DISABLE KEYS */;
INSERT INTO `divisions` VALUES (1,'Barisal'),(2,'Chittagong'),(3,'Dhaka'),(4,'Khulna'),(5,'Rajshahi'),(6,'Rangpur'),(7,'Sylhet'),(8,'Mymensingh');
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
INSERT INTO `nid` VALUES (6,'f837a6f4369555646c943f616b7cecd097dc43e6e334c78c50ee5264532aa0b94445c847663ce8f88a10ffc0a7e13b8138d5eac7f6b17f5e8ccc4f875fe75cb960dcf479a2104583a1146d9eb2f6a8374e6ad18c089de9c4167ca7d4e8e17b1ff8.png','75924dc90a046c4fc7af1afab6e7f67213d48d50c1307bf45ddecdb483662fe2833592e30ce9161258a09360344ca4b6002361c2d0d325847dc8603982af3731cba10c6a391a115da4518ea0fd5c390ba364a158adfb5b1a14f8ea0f6abbcd7e39.png');
/*!40000 ALTER TABLE `nid` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `organizations`
--

DROP TABLE IF EXISTS `organizations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `organizations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL,
  `details` varchar(1500) DEFAULT NULL,
  `contact` varchar(11) DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
/*!40000 ALTER TABLE `organizations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profile_picture`
--

DROP TABLE IF EXISTS `profile_picture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profile_picture` (
  `id` int NOT NULL,
  `profile_picture` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `profile_pic_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profile_picture`
--

LOCK TABLES `profile_picture` WRITE;
/*!40000 ALTER TABLE `profile_picture` DISABLE KEYS */;
INSERT INTO `profile_picture` VALUES (6,'7a6da0e3925bd770c60d7fb1b50d608cfc7a9a1cdbb8172d422e721b4fbf1209387eacff16815041f0a3e7d1edda005716fb943120b0b67a517af2545d9e7240f662fd1b720ca544609d90d4dacc443bfe68b621f3fcc9f6d0792f048490e3dd80.JPG');
/*!40000 ALTER TABLE `profile_picture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upazillas`
--

DROP TABLE IF EXISTS `upazillas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upazillas` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `district_id` int unsigned NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=595 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upazillas`
--

LOCK TABLES `upazillas` WRITE;
/*!40000 ALTER TABLE `upazillas` DISABLE KEYS */;
INSERT INTO `upazillas` VALUES (1,34,'Amtali'),(2,34,'Bamna '),(3,34,'Barguna Sadar '),(4,34,'Betagi '),(5,34,'Patharghata '),(6,34,'Taltali '),(7,35,'Muladi '),(8,35,'Babuganj '),(9,35,'Agailjhara '),(10,35,'Barisal Sadar '),(11,35,'Bakerganj '),(12,35,'Banaripara '),(13,35,'Gaurnadi '),(14,35,'Hizla '),(15,35,'Mehendiganj '),(16,35,'Wazirpur '),(17,36,'Bhola Sadar '),(18,36,'Burhanuddin '),(19,36,'Char Fasson '),(20,36,'Daulatkhan '),(21,36,'Lalmohan '),(22,36,'Manpura '),(23,36,'Tazumuddin '),(24,37,'Jhalokati Sadar '),(25,37,'Kathalia '),(26,37,'Nalchity '),(27,37,'Rajapur '),(28,38,'Bauphal '),(29,38,'Dashmina '),(30,38,'Galachipa '),(31,38,'Kalapara '),(32,38,'Mirzaganj '),(33,38,'Patuakhali Sadar '),(34,38,'Dumki '),(35,38,'Rangabali '),(36,39,'Bhandaria'),(37,39,'Kaukhali'),(38,39,'Mathbaria'),(39,39,'Nazirpur'),(40,39,'Nesarabad'),(41,39,'Pirojpur Sadar'),(42,39,'Zianagar'),(43,40,'Bandarban Sadar'),(44,40,'Thanchi'),(45,40,'Lama'),(46,40,'Naikhongchhari'),(47,40,'Ali kadam'),(48,40,'Rowangchhari'),(49,40,'Ruma'),(50,41,'Brahmanbaria Sadar '),(51,41,'Ashuganj '),(52,41,'Nasirnagar '),(53,41,'Nabinagar '),(54,41,'Sarail '),(55,41,'Shahbazpur Town'),(56,41,'Kasba '),(57,41,'Akhaura '),(58,41,'Bancharampur '),(59,41,'Bijoynagar '),(60,42,'Chandpur Sadar'),(61,42,'Faridganj'),(62,42,'Haimchar'),(63,42,'Haziganj'),(64,42,'Kachua'),(65,42,'Matlab Uttar'),(66,42,'Matlab Dakkhin'),(67,42,'Shahrasti'),(68,43,'Anwara '),(69,43,'Banshkhali '),(70,43,'Boalkhali '),(71,43,'Chandanaish '),(72,43,'Fatikchhari '),(73,43,'Hathazari '),(74,43,'Lohagara '),(75,43,'Mirsharai '),(76,43,'Patiya '),(77,43,'Rangunia '),(78,43,'Raozan '),(79,43,'Sandwip '),(80,43,'Satkania '),(81,43,'Sitakunda '),(82,44,'Barura '),(83,44,'Brahmanpara '),(84,44,'Burichong '),(85,44,'Chandina '),(86,44,'Chauddagram '),(87,44,'Daudkandi '),(88,44,'Debidwar '),(89,44,'Homna '),(90,44,'Comilla Sadar '),(91,44,'Laksam '),(92,44,'Monohorgonj '),(93,44,'Meghna '),(94,44,'Muradnagar '),(95,44,'Nangalkot '),(96,44,'Comilla Sadar South '),(97,44,'Titas '),(98,45,'Chakaria '),(99,45,'Eidgah'),(100,45,'Cox\'s Bazar Sadar '),(101,45,'Kutubdia '),(102,45,'Maheshkhali '),(103,45,'Ramu '),(104,45,'Teknaf '),(105,45,'Ukhia '),(106,45,'Pekua '),(107,46,'Feni Sadar'),(108,46,'Chagalnaiya'),(109,46,'Daganbhyan'),(110,46,'Parshuram'),(111,46,'Fhulgazi'),(112,46,'Sonagazi'),(113,47,'Dighinala '),(114,47,'Khagrachhari '),(115,47,'Lakshmichhari '),(116,47,'Mahalchhari '),(117,47,'Manikchhari '),(118,47,'Matiranga '),(119,47,'Panchhari '),(120,47,'Ramgarh '),(121,48,'Lakshmipur Sadar '),(122,48,'Raipur '),(123,48,'Ramganj '),(124,48,'Ramgati '),(125,48,'Komol Nagar '),(126,49,'Noakhali Sadar '),(127,49,'Begumganj '),(128,49,'Chatkhil '),(129,49,'Companyganj '),(130,49,'Shenbag '),(131,49,'Hatia '),(132,49,'Kobirhat '),(133,49,'Sonaimuri '),(134,49,'Suborno Char '),(135,50,'Rangamati Sadar '),(136,50,'Belaichhari '),(137,50,'Bagaichhari '),(138,50,'Barkal '),(139,50,'Juraichhari '),(140,50,'Rajasthali '),(141,50,'Kaptai '),(142,50,'Langadu '),(143,50,'Nannerchar '),(144,50,'Kaukhali '),(150,2,'Faridpur Sadar '),(151,2,'Boalmari '),(152,2,'Alfadanga '),(153,2,'Madhukhali '),(154,2,'Bhanga '),(155,2,'Nagarkanda '),(156,2,'Charbhadrasan '),(157,2,'Sadarpur '),(158,2,'Shaltha '),(159,3,'Gazipur Sadar-Joydebpur'),(160,3,'Kaliakior'),(161,3,'Kapasia'),(162,3,'Sripur'),(163,3,'Kaliganj'),(164,3,'Tongi'),(165,4,'Gopalganj Sadar '),(166,4,'Kashiani '),(167,4,'Kotalipara '),(168,4,'Muksudpur '),(169,4,'Tungipara '),(170,5,'Dewanganj '),(171,5,'Baksiganj '),(172,5,'Islampur '),(173,5,'Jamalpur Sadar '),(174,5,'Madarganj '),(175,5,'Melandaha '),(176,5,'Sarishabari '),(177,5,'Narundi Police I.C'),(178,6,'Astagram '),(179,6,'Bajitpur '),(180,6,'Bhairab '),(181,6,'Hossainpur '),(182,6,'Itna '),(183,6,'Karimganj '),(184,6,'Katiadi '),(185,6,'Kishoreganj Sadar '),(186,6,'Kuliarchar '),(187,6,'Mithamain '),(188,6,'Nikli '),(189,6,'Pakundia '),(190,6,'Tarail '),(191,7,'Madaripur Sadar'),(192,7,'Kalkini'),(193,7,'Rajoir'),(194,7,'Shibchar'),(195,8,'Manikganj Sadar '),(196,8,'Singair '),(197,8,'Shibalaya '),(198,8,'Saturia '),(199,8,'Harirampur '),(200,8,'Ghior '),(201,8,'Daulatpur '),(202,9,'Lohajang '),(203,9,'Sreenagar '),(204,9,'Munshiganj Sadar '),(205,9,'Sirajdikhan '),(206,9,'Tongibari '),(207,9,'Gazaria '),(208,10,'Bhaluka'),(209,10,'Trishal'),(210,10,'Haluaghat'),(211,10,'Muktagachha'),(212,10,'Dhobaura'),(213,10,'Fulbaria'),(214,10,'Gaffargaon'),(215,10,'Gauripur'),(216,10,'Ishwarganj'),(217,10,'Mymensingh Sadar'),(218,10,'Nandail'),(219,10,'Phulpur'),(220,11,'Araihazar '),(221,11,'Sonargaon '),(222,11,'Bandar'),(223,11,'Naryanganj Sadar '),(224,11,'Rupganj '),(225,11,'Siddirgonj '),(226,12,'Belabo '),(227,12,'Monohardi '),(228,12,'Narsingdi Sadar '),(229,12,'Palash '),(230,12,'Raipura , Narsingdi'),(231,12,'Shibpur '),(232,13,'Kendua Upazilla'),(233,13,'Atpara Upazilla'),(234,13,'Barhatta Upazilla'),(235,13,'Durgapur Upazilla'),(236,13,'Kalmakanda Upazilla'),(237,13,'Madan Upazilla'),(238,13,'Mohanganj Upazilla'),(239,13,'Netrakona-S Upazilla'),(240,13,'Purbadhala Upazilla'),(241,13,'Khaliajuri Upazilla'),(242,14,'Baliakandi '),(243,14,'Goalandaghat '),(244,14,'Pangsha '),(245,14,'Kalukhali '),(246,14,'Rajbari Sadar '),(247,15,'Shariatpur Sadar -Palong'),(248,15,'Damudya '),(249,15,'Naria '),(250,15,'Jajira '),(251,15,'Bhedarganj '),(252,15,'Gosairhat '),(253,16,'Jhenaigati '),(254,16,'Nakla '),(255,16,'Nalitabari '),(256,16,'Sherpur Sadar '),(257,16,'Sreebardi '),(258,17,'Tangail Sadar '),(259,17,'Sakhipur '),(260,17,'Basail '),(261,17,'Madhupur '),(262,17,'Ghatail '),(263,17,'Kalihati '),(264,17,'Nagarpur '),(265,17,'Mirzapur '),(266,17,'Gopalpur '),(267,17,'Delduar '),(268,17,'Bhuapur '),(269,17,'Dhanbari '),(270,55,'Bagerhat Sadar '),(271,55,'Chitalmari '),(272,55,'Fakirhat '),(273,55,'Kachua '),(274,55,'Mollahat '),(275,55,'Mongla '),(276,55,'Morrelganj '),(277,55,'Rampal '),(278,55,'Sarankhola '),(279,56,'Damurhuda '),(280,56,'Chuadanga-S '),(281,56,'Jibannagar '),(282,56,'Alamdanga '),(283,57,'Abhaynagar '),(284,57,'Keshabpur '),(285,57,'Bagherpara '),(286,57,'Jessore Sadar '),(287,57,'Chaugachha '),(288,57,'Manirampur '),(289,57,'Jhikargachha '),(290,57,'Sharsha '),(291,58,'Jhenaidah Sadar '),(292,58,'Maheshpur '),(293,58,'Kaliganj '),(294,58,'Kotchandpur '),(295,58,'Shailkupa '),(296,58,'Harinakunda '),(297,59,'Terokhada '),(298,59,'Batiaghata '),(299,59,'Dacope '),(300,59,'Dumuria '),(301,59,'Dighalia '),(302,59,'Koyra '),(303,59,'Paikgachha '),(304,59,'Phultala '),(305,59,'Rupsa '),(306,60,'Kushtia Sadar'),(307,60,'Kumarkhali'),(308,60,'Daulatpur'),(309,60,'Mirpur'),(310,60,'Bheramara'),(311,60,'Khoksa'),(312,61,'Magura Sadar '),(313,61,'Mohammadpur '),(314,61,'Shalikha '),(315,61,'Sreepur '),(316,62,'angni '),(317,62,'Mujib Nagar '),(318,62,'Meherpur-S '),(319,63,'Narail-S Upazilla'),(320,63,'Lohagara Upazilla'),(321,63,'Kalia Upazilla'),(322,64,'Satkhira Sadar '),(323,64,'Assasuni '),(324,64,'Debhata '),(325,64,'Tala '),(326,64,'Kalaroa '),(327,64,'Kaliganj '),(328,64,'Shyamnagar '),(329,18,'Adamdighi'),(330,18,'Bogra Sadar'),(331,18,'Sherpur'),(332,18,'Dhunat'),(333,18,'Dhupchanchia'),(334,18,'Gabtali'),(335,18,'Kahaloo'),(336,18,'Nandigram'),(337,18,'Sahajanpur'),(338,18,'Sariakandi'),(339,18,'Shibganj'),(340,18,'Sonatala'),(341,19,'Joypurhat S'),(342,19,'Akkelpur'),(343,19,'Kalai'),(344,19,'Khetlal'),(345,19,'Panchbibi'),(346,20,'Naogaon Sadar '),(347,20,'Mohadevpur '),(348,20,'Manda '),(349,20,'Niamatpur '),(350,20,'Atrai '),(351,20,'Raninagar '),(352,20,'Patnitala '),(353,20,'Dhamoirhat '),(354,20,'Sapahar '),(355,20,'Porsha '),(356,20,'Badalgachhi '),(357,21,'Natore Sadar '),(358,21,'Baraigram '),(359,21,'Bagatipara '),(360,21,'Lalpur '),(361,21,'Natore Sadar '),(362,21,'Baraigram '),(363,22,'Bholahat '),(364,22,'Gomastapur '),(365,22,'Nachole '),(366,22,'Nawabganj Sadar '),(367,22,'Shibganj '),(368,23,'Atgharia '),(369,23,'Bera '),(370,23,'Bhangura '),(371,23,'Chatmohar '),(372,23,'Faridpur '),(373,23,'Ishwardi '),(374,23,'Pabna Sadar '),(375,23,'Santhia '),(376,23,'Sujanagar '),(377,24,'Bagha'),(378,24,'Bagmara'),(379,24,'Charghat'),(380,24,'Durgapur'),(381,24,'Godagari'),(382,24,'Mohanpur'),(383,24,'Paba'),(384,24,'Puthia'),(385,24,'Tanore'),(386,25,'Sirajganj Sadar '),(387,25,'Belkuchi '),(388,25,'Chauhali '),(389,25,'Kamarkhanda '),(390,25,'Kazipur '),(391,25,'Raiganj '),(392,25,'Shahjadpur '),(393,25,'Tarash '),(394,25,'Ullahpara '),(395,26,'Birampur '),(396,26,'Birganj'),(397,26,'Biral '),(398,26,'Bochaganj '),(399,26,'Chirirbandar '),(400,26,'Phulbari '),(401,26,'Ghoraghat '),(402,26,'Hakimpur '),(403,26,'Kaharole '),(404,26,'Khansama '),(405,26,'Dinajpur Sadar '),(406,26,'Nawabganj'),(407,26,'Parbatipur '),(408,27,'Fulchhari'),(409,27,'Gaibandha sadar'),(410,27,'Gobindaganj'),(411,27,'Palashbari'),(412,27,'Sadullapur'),(413,27,'Saghata'),(414,27,'Sundarganj'),(415,28,'Kurigram Sadar'),(416,28,'Nageshwari'),(417,28,'Bhurungamari'),(418,28,'Phulbari'),(419,28,'Rajarhat'),(420,28,'Ulipur'),(421,28,'Chilmari'),(422,28,'Rowmari'),(423,28,'Char Rajibpur'),(424,29,'Lalmanirhat Sadar'),(425,29,'Aditmari'),(426,29,'Kaliganj'),(427,29,'Hatibandha'),(428,29,'Patgram'),(429,30,'Nilphamari Sadar'),(430,30,'Saidpur'),(431,30,'Jaldhaka'),(432,30,'Kishoreganj'),(433,30,'Domar'),(434,30,'Dimla'),(435,31,'Panchagarh Sadar'),(436,31,'Debiganj'),(437,31,'Boda'),(438,31,'Atwari'),(439,31,'Tetulia'),(440,32,'Badarganj'),(441,32,'Mithapukur'),(442,32,'Gangachara'),(443,32,'Kaunia'),(444,32,'Rangpur Sadar'),(445,32,'Pirgachha'),(446,32,'Pirganj'),(447,32,'Taraganj'),(448,33,'Thakurgaon Sadar '),(449,33,'Pirganj '),(450,33,'Baliadangi '),(451,33,'Haripur '),(452,33,'Ranisankail '),(453,51,'Ajmiriganj'),(454,51,'Baniachang'),(455,51,'Bahubal'),(456,51,'Chunarughat'),(457,51,'Habiganj Sadar'),(458,51,'Lakhai'),(459,51,'Madhabpur'),(460,51,'Nabiganj'),(461,51,'Shaistagonj '),(462,52,'Moulvibazar Sadar'),(463,52,'Barlekha'),(464,52,'Juri'),(465,52,'Kamalganj'),(466,52,'Kulaura'),(467,52,'Rajnagar'),(468,52,'Sreemangal'),(469,53,'Bishwamvarpur'),(470,53,'Chhatak'),(471,53,'Derai'),(472,53,'Dharampasha'),(473,53,'Dowarabazar'),(474,53,'Jagannathpur'),(475,53,'Jamalganj'),(476,53,'Sulla'),(477,53,'Sunamganj Sadar'),(478,53,'Shanthiganj'),(479,53,'Tahirpur'),(480,54,'Sylhet Sadar'),(481,54,'Beanibazar'),(482,54,'Bishwanath'),(483,54,'Dakshin Surma '),(484,54,'Balaganj'),(485,54,'Companiganj'),(486,54,'Fenchuganj'),(487,54,'Golapganj'),(488,54,'Gowainghat'),(489,54,'Jaintiapur'),(490,54,'Kanaighat'),(491,54,'Zakiganj'),(492,54,'Nobigonj'),(493,1,'Adabor'),(494,1,'Airport'),(495,1,'Badda'),(496,1,'Banani'),(497,1,'Bangshal'),(498,1,'Bhashantek'),(499,1,'Cantonment'),(500,1,'Chackbazar'),(501,1,'Darussalam'),(502,1,'Daskhinkhan'),(503,1,'Demra'),(504,1,'Dhamrai'),(505,1,'Dhanmondi'),(506,1,'Dohar'),(507,1,'Gandaria'),(508,1,'Gulshan'),(509,1,'Hazaribag'),(510,1,'Jatrabari'),(511,1,'Kafrul'),(512,1,'Kalabagan'),(513,1,'Kamrangirchar'),(514,1,'Keraniganj'),(515,1,'Khilgaon'),(516,1,'Khilkhet'),(517,1,'Kotwali'),(518,1,'Lalbag'),(519,1,'Mirpur Model'),(520,1,'Mohammadpur'),(521,1,'Motijheel'),(522,1,'Mugda'),(523,1,'Nawabganj'),(524,1,'New Market'),(525,1,'Pallabi'),(526,1,'Paltan'),(527,1,'Ramna'),(528,1,'Rampura'),(529,1,'Rupnagar'),(530,1,'Sabujbag'),(531,1,'Savar'),(532,1,'Shah Ali'),(533,1,'Shahbag'),(534,1,'Shahjahanpur'),(535,1,'Sherebanglanagar'),(536,1,'Shyampur'),(537,1,'Sutrapur'),(538,1,'Tejgaon'),(539,1,'Tejgaon I/A'),(540,1,'Turag'),(541,1,'Uttara'),(542,1,'Uttara West'),(543,1,'Uttarkhan'),(544,1,'Vatara'),(545,1,'Wari'),(546,1,'Others'),(547,35,'Airport'),(548,35,'Kawnia'),(549,35,'Bondor'),(550,35,'Others'),(551,24,'Boalia'),(552,24,'Motihar'),(553,24,'Shahmokhdum'),(554,24,'Rajpara'),(555,24,'Others'),(556,43,'Akborsha'),(557,43,'Baijid bostami'),(558,43,'Bakolia'),(559,43,'Bandar'),(560,43,'Chandgaon'),(561,43,'Chokbazar'),(562,43,'Doublemooring'),(563,43,'EPZ'),(564,43,'Hali Shohor'),(565,43,'Kornafuli'),(566,43,'Kotwali'),(567,43,'Kulshi'),(568,43,'Pahartali'),(569,43,'Panchlaish'),(570,43,'Potenga'),(571,43,'Shodhorgat'),(572,43,'Others'),(573,44,'Others'),(574,59,'Aranghata'),(575,59,'Daulatpur'),(576,59,'Harintana'),(577,59,'Horintana'),(578,59,'Khalishpur'),(579,59,'Khanjahan Ali'),(580,59,'Khulna Sadar'),(581,59,'Labanchora'),(582,59,'Sonadanga'),(583,59,'Others'),(584,2,'Others'),(585,4,'Others'),(586,5,'Others'),(587,54,'Airport'),(588,54,'Hazrat Shah Paran'),(589,54,'Jalalabad'),(590,54,'Kowtali'),(591,54,'Moglabazar'),(592,54,'Osmani Nagar'),(593,54,'South Surma'),(594,54,'Others');
/*!40000 ALTER TABLE `upazillas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `id` int NOT NULL,
  `house` varchar(250) DEFAULT NULL,
  `street` varchar(250) DEFAULT NULL,
  `division` int NOT NULL,
  `district` int NOT NULL,
  `upazilla` int NOT NULL,
  `zipcode` int DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_address_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (6,'7C','311, West Shewrapara, Mirpur',3,1,519,1216,23.7910932,90.3736199);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profile` (
  `id` int NOT NULL,
  `contact` varchar(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `BG` enum('A+','A-','B+','B-','O+','O-','AB+','AB-') DEFAULT NULL,
  `gender` enum('Male','Female','Others') DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_profile_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (6,'01867057600','2000-11-30','O+','Male');
/*!40000 ALTER TABLE `user_profile` ENABLE KEYS */;
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
  `eligibility_test` enum('yes','no') NOT NULL DEFAULT 'no',
  `joined` date NOT NULL,
  `provider` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Minhaz','Kamal','minhaz.kamal9900@gmail.com',NULL,'yes','yes','yes','no','2021-08-09','google');
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

-- Dump completed on 2021-08-11 17:14:40
