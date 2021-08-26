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
  `id` int NOT NULL AUTO_INCREMENT,
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
INSERT INTO `nid` VALUES (6,'f837a6f4369555646c943f616b7cecd097dc43e6e334c78c50ee5264532aa0b94445c847663ce8f88a10ffc0a7e13b8138d5eac7f6b17f5e8ccc4f875fe75cb960dcf479a2104583a1146d9eb2f6a8374e6ad18c089de9c4167ca7d4e8e17b1ff8.png','75924dc90a046c4fc7af1afab6e7f67213d48d50c1307bf45ddecdb483662fe2833592e30ce9161258a09360344ca4b6002361c2d0d325847dc8603982af3731cba10c6a391a115da4518ea0fd5c390ba364a158adfb5b1a14f8ea0f6abbcd7e39.png'),(7,'8bd3062383a9d2a300fd8f450bc04b1801b023f257e16560e882df0b826a739620a26f2c4d64696285cfc6eb1246a5516fb0b363b5a3c335a6d842c83048fc43ed42f81e260e05ebd502aa71e36dead854b544cd4a67dafd56ca8f1d708e936dfe.png','9ddb7e1042c2975b8b559572faefb545104720c531477769657f852beb55560ffac91ed36538fab641e28997e74c6a09217fd75859e876b13e68a8b66c52873ca9204d8ca75ba63b121454941b388527ea3f7e5105096d81549d6574885cb1f68d.png'),(8,'5701d15d4c6486cebc820759aa5ce37637583b7ce0c3c9563068ba748f05bac88ce68fbebc4d9341bedc408b81a802c3b7176fcc39c5d4d4f3510f8f474116e49a2de1fd883cca828c2e02040a0cdabdc679ded06897468be2e00fbdaeac77798b.png','2b2acad320ec5507b92106550483198d4aeceb0cf396fadf1dc720215654105a190f45f3209ee0d228fde456dae36fba698cdd32e0f4d5c619a4d8a5b201c2eb5291b13fdc9435635308919e02382201f2829b6989cfba6ee460f51aac5eda6765.png'),(9,'d7db0873180de7b56dd27f11d013aeb8f3bfb4c08e43ca09df32d01437ca3b0cf75312dedbfce0dbe6172167db19f8970841c776c4d98615c56186bd1d103d0b689f10b221ef6b8b16256551542ccd7845a998b5d7faaefbc702b7e74af52a641a.png','2431b1241f8e23fc187da10d13e7773b49651a4beb54a585f7e44cee957aa8fa3bae131e28051ed891ec3d790552b7ac920bfbadf1795513ba66b61c197bd9dbd32421efef49f1aff2c05770c19e595c9f48a32b889ea04d81489c5ff2d89365ea.png'),(10,'a24734cd29b4337f0a6764df2e1d3502ebad8847ffc7be96ebcdf32750a3d4d9a447c040a2279af6e8f7edb0a8282e97a9eccc01eec6b58622a7eacdc25fc9d25133ab03ec0a68a635606ae82b008110c4cc23bc8f2df620f11a815cbf3f8f3debe3.png','f6221377dd511df670e66aea133acc6aa4e7cc998a78d1d3efcb8015d1dddb98017277692b745431bdc8fb7622a24f18a9133e399c56ac290572276a94fa64dbaf5adbd7e4eb26d008d0f7fddb6a9077c15233626eb7d74eceafed9bb35a69669c08.png'),(11,'eb662f387ff655b2a8fa1a5fbeabfd0ee60ba9f9716d196e416dde77faa29b945f4b45043f9f474c3533856eecb2ecfcb47dae99b96a88ca0f0277bb3423e5610d9944e53a640ad0e5659cd52f8c148ddfbb6442c1b718f7b7a786784e127579e1c6.png','4f2e39bbb43378187d21d543fafbea0e4ed5a3665e39bc9d63daafd8be98327702be1d3db62a9196a9f744433389e2c323c4952b5718d7f0245211ec7c285cc6f6360afd677c1ea78b8529801e3c3eb80274a463fcf81196595f041e96fcfd7f5d32.png'),(12,'5bd57f2eb47f220bab815b0ae80d03b8ad10e22f1e4558e0ba07950a4775485bfd67440c06ca9384cf145efc3cb09978aa15227181e2fab241b2371b5c1051b53a1599e0f74c70baafbe74eb9c8e099b6ed5b26b54631425bbc9cd1778e87ef62791.png','ddadbbb611cb40ad0dc6d72a57f00fe9b9e073b72f7633869527cd62591e926d7c5057d37ab61f77c15147cb35b1f8d5deccde481ed782bca122289afcc2bfc75019d4a1bdc6166f5bbe9a4966698cf09dd07c9f88ac41d5edd0b32f6ecac155032e.png'),(13,'9ea39760cfef9d52d148d6b6da899d8ea30d9dd032d8bc3171452ce663b0bff5abdde63c4506a768f08408c7b751a2db3f9b306f7169a7e0516065e32a260ac737509757d75b8f60b31a879598bff98e1e0de34a7a1b4a08d98442d21ce2d930a04c.png','0c9d678818dbfaf12f519fca8c07a37d76dba292e72ef3c4b089d02fca8fc667dec93fb5152c83e06f10caa04f012a3f3267d8d72cc1e3699da53843c508e509ca89c757c407f4add7ec130a31a428f6843e8f0a541a00cbdad303a30efe9b71bf21.png'),(14,'a95508a4166bbab23ceacca85fc9ef1a8537ca41af520de42dcfee1523645fa7c10f292f778ffee1240dd240e48092b4dcf0816740daf1cf5599135267d811376ce2313078f06645e648f6e16cb92b0f7ed053d77db561c34ff4a1514f80e3724eb0.png','b8aa12f6ed94587b6ec1186483b60330a52828974cc73935f13da0c29e20c42c537862c5e6bead1b9e61ed2bb06cf8e6360dcf323aa9eed0ef094f083132b863ce79bd4244b10e9efe80b25b3b1f40defc1f824f3195db0011c7cabafb44fd53a44f.png'),(15,'778550b386358d229da96642dd3a63de34187ebbfac27585f82b9e0b8b891dce0885c06ec43f7f866eb18f07bef1a9cb4485f87ca13643d0c2029a79b6e055a5416fee93ba1e4f51af7f4de221bedeeea7b2e2b8ea131ebc1cbf4c6d29f29494e2fc.png','e4532a6f255e35933eeea54c873c2156c71b04df6a2963bb81fce7c5b0f6b1f17d408257e579321f00c3ea3852b08280cc61e61ebd6e0581dc9942e6e01d98fb01b09b304872408cc0aed5e8138d0d8035072ace415cbd6bcc240212e49644415fcd.png'),(16,'f969ba172187c99f047f552b914a8fdbb1648fbebd847906f696e1b7c6fb2638b98e778c59c3a1d453373efbb5623aed84454dea47a313b697bfa3826e72ab2503aa6f085e43839fc6329f7cd93420ac98a9bebef3a2bb314318e7af6b0476b788ea.png','541cee3c535a62e2aed6efbb3350a55474cac8e7bf96e8d49902664df778ce9157cdd39b6d301d7daa7c413daa28975285573fb7764ccabe40f211cb469ef71039fe04c2b122a5aab47e207801060a66d5ee4e62d6d8c075dd904c4cebffd9aca57c.png'),(17,'3831583606f5076d504bfe3022f32dffd236ab62d9c845c1253abe7767cb3c155bbb4c5cc284a91551b1f2394dee5718d66bbf4c997883ffa10d6f94e3de08b6fbce7132e0f4a34fd996771d21a55c99773036d25c4bea1ba9b70c86f01a6362e2d3.png','bcd621e04b421d6f79eb91f89ffbd58b323eea689ed79eb7dc67ddf8164ba0532364af3831c54cd87a1654fdb5de7e33d3b0723759eb04cb7e69029c0cbd4a24be29af1e1816e815f26d49da8ec395ce898f567c3181b13e10c0d9191f3052b2b096.png'),(18,'5621801e886a5001107609ab4a4a66bb5c65007abc5c21a5d55d9be3ec05d01d029c5102122345fcd375e390f36246383d21e7ff5555a41bb32fb5ea08a11950bc411f012575a8736554f199d62db587a7a42d1b5ac0c38e614a875f0d952d1597a8.png','a5d2e9143c378524acdf0f20b2a5783974d6f06858d5df82d46ec51b207ca13089cdfe8097b5ecfc99d6ea04bc2a3fb0de916b27b42cf4470b81f76b3665103b5a639081cc0038d2ab3483edf2bbf891768aacd794b21ba20116c2b812b97212bd5d.png'),(19,'41b00dc5c801d93d01897846ddc6ef2090fd28dfb2c796f545f3633579e85d5da0c3501a8d1cc8f697d00da3535bd358bc757fedfbc17d9fc6af3400cfa417883215535d2f3c635c4105d9005f792cd4323d8d748dc15717e44b260c39c21610d61b.png','ade95b8a2ed2b696a581d90accaa4603fce13a66f1c764ab65b2de705b419166e0d2507fabbed45a010556cc51a6ed01b8ccdb8b5565d2ebb82ac2dc09b372d285cf5900f674e771ceb1c12feed9be136e6401c3e500ef6fff68809cc38dd861c6b4.png'),(20,'6997749de0e437aacd05ac8cb0ceeeca87c621d27eb277dddbc72f81bfdd4371ad7e87b278c51987ad2baf064c05ad378caa67553ca4ea8ec86dd98615b8be15e2c6c7fec9aa7d5b69caf102f180524c1de2b257a7edf02e3fcfcfa7933d7f9605f6.png','fb6ffa50e53d6887e076b039bdab2c92e39eb3f1248e4bb184e62ec09b57e4aa2fd78958edf330c15750550f072c54f2416c387c59a739dd2b718922d89fa24c2786596954fee6f6072c792549875f5bf1a7f995dcd09770f0df9cb544461eaea361.png'),(21,'583eea98e661210b5c0822ec6065df189d59d4e5eb527b379e4d291e6beccd2df4e542c6b2c1698f5da570e64a0d49236a9175f96f30fad6b7a11f6ba1c45c164e6e1d7325994d65e0c08ef7e3b97a9fdc80e3f58996bd14a177e9693fef004e4199.png','41155a0448ea89f8bbf68e44d67ad55a8cc1a58b9ad791a224d0de3d6d788c70fd062fd563842e61822a0871b0a4a4ce8ea4af59e5c856b96c1e3362ab2fc5ad76ace95fbb36211a2cd3a540fe33d51eba81723eb37e6a4f060268defd3a0fb327d4.png'),(22,'fd112b1eecd18e215b7c2e48caae331dd59b60e8db1e5e394538ccdf948bd0d59035fbd6ee25f8048acf0fddbcaf1bcc4cb8b24c579af9f1b505f31dd289a475b2837103ea346dec06f70bdc02773618c75c11be072e4a2aab498640f62a2cc610c9.png','7c57fd884076ea71b1cfa2cdafbb29c3880d1f68f6e52c76d199ee7f2670998123143357e9fa07b0826fcc983a504462e575a4503d6d7ba55d84de09290a395c78f88d4ad9105d4bb0d0195f2ae3f5e8d0916e577ecd787d20ddf94756e7f7c4036c.png');
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `organizations`
--

LOCK TABLES `organizations` WRITE;
/*!40000 ALTER TABLE `organizations` DISABLE KEYS */;
INSERT INTO `organizations` VALUES (1,'Dhaka Medical College Hospital','Secretariat Road, Shahbag, Dhaka, Dhaka','02-55165088',23.725869,90.396524),(2,'Sir Salimullah Medical College Hospitals','Mitford road, Chackbazar, Dhaka, Dhaka','01703636314',23.711423,90.401239),(3,'Square Hospitals','Bir Uttam Qazi Nuruzzaman Road, Tejgaon, Dhaka, Dhaka','02-8144400',23.752927,90.381731),(4,'Evercare Hospital Dhaka','Hospital Road, Vatara, Dhaka, Dhaka','10678',23.810054,90.43254),(5,'Mymensingh Medical College','Dhaka-Mymensingh Road, Mymensingh Sadar, Mymensingh, Mymensingh','01713332468',24.743187,90.409051),(6,'Chittagong Medical College','KBF Kader Road, Kotwali, Chittagong, Chittagong','031-630335',22.359414,91.830903),(7,'Evercare Hospital Chitagong','Kuwaish Road, Chandgaon, Chittagong, Chittagong','10678',22.401834,91.849365),(8,'Chittagong General Hospital','Anderkilla Road, Kotwali, Chittagong, Chittagong','01711468326',22.340604,91.837763),(9,'BIRDEM General Hospital','Kazi Nazrul Islam Ave, Shahbag, Dhaka, Dhaka','02-41060501',23.738799,90.396402),(10,'BSMMU Hospitals','Kazi Nazrul Islam Avenue, Shahbag, Dhaka, Dhaka','01866637482',23.739668,90.394563),(11,'United Hospital Ltd.','Hospital Road, Gulshan, Dhaka, Dhaka','',23.804578,90.415648),(12,'Parkview Hospital Ltd','Pachlaish Road, Panchlaish, Chittagong, Chittagong','01976022333',22.363095,91.835649),(13,'National Hospital Pvt Ltd','Mehedibag Road, Kotwali, Chittagong, Chittagong','031623753',22.35486,91.82491),(14,'Max Hospitals Ltd','Hussain Park Street, Kotwali, Chittagong, Chittagong','01713998199',22.355308,91.825237),(15,'Imperial Hospitals Ltd','Zakir Hussain Road, Kulshi, Chittagong, Chittagong','0961224724',22.359176,91.795598),(16,'Shaheed Tajuddin Ahmed Medical College Hospital ','Hospital Road, Gazipur Sadar-Joydebpur, Gazipur, Dhaka','',23.9992261,90.424614);
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
INSERT INTO `profile_picture` VALUES (6,'avatar.png'),(7,'avatar.png'),(8,'avatar.png'),(9,'avatar.png'),(10,'avatar.png'),(11,'avatar.png'),(12,'avatar.png'),(13,'avatar.png'),(14,'avatar.png'),(15,'avatar.png'),(16,'avatar.png'),(17,'avatar.png'),(18,'avatar.png'),(19,'avatar.png'),(20,'avatar.png'),(21,'avatar.png'),(22,'avatar.png');
/*!40000 ALTER TABLE `profile_picture` ENABLE KEYS */;
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
  `zipcode` varchar(10) DEFAULT NULL,
  `lon` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  KEY `user_address_upazilla_idx` (`upazilla`),
  KEY `user_address_district_idx` (`district`),
  KEY `user_address_division_idx` (`division`),
  CONSTRAINT `user_address_district` FOREIGN KEY (`district`) REFERENCES `districts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_address_division` FOREIGN KEY (`division`) REFERENCES `divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_address_upazilla` FOREIGN KEY (`upazilla`) REFERENCES `upazillas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (6,'7C','311, West Shewrapara, Mirpur',3,1,519,'1216',23.7911459,90.3736772),(7,'Chowdhury Vila','Enam Road',2,43,566,'4203',22.342895,91.829046),(8,'Khan Villa','Highway Road',2,43,561,'4205',22.303201,91.789352),(9,'King Villa','King Road',2,43,567,'4100',22.364765,91.803119),(10,'Bokhsi House','Bokhs Road',2,43,564,'4002',22.303201,91.789352),(11,'Doctor House','Medical Road',2,43,569,'4500',22.375772,91.827392),(12,'brothers villa','College Road',2,43,570,'4302',22.2544,91.7948),(13,'Cumilla Vila','Cumilla House',2,43,560,'4322',22.393836,91.865371),(14,'Bokhsi Vila','Bokhsi Road',2,43,565,'4731',22.303201,91.789352),(15,'Dhanshiri','Apon Road',2,43,568,'4800',22.358732,91.775428),(16,'Shadhinota','Mujib Road',3,1,511,'2000',23.7931,90.3861),(17,'Chowdhury Vila','Khan Road',3,1,525,'1000',23.827398,90.364473),(18,'Apon Nibash','Hospital Road',3,1,544,'1200',23.709226,90.40739),(19,'Bokhsi House','Bokhs Road',3,1,508,'1500',23.7917,90.4167),(20,'Poushi','School Road',3,1,533,'1200',23.736484,90.397323),(21,'Artboard','Choumuhuni Road',3,1,505,'1100',23.744806,90.373922),(22,'46','Road-2, Shekhertek',3,1,520,'',23.760178,90.355229);
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
  `contact` varchar(11) NOT NULL,
  `dob` date NOT NULL,
  `BG` enum('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
  `gender` enum('Male','Female','Others') NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_profile_id` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profile`
--

LOCK TABLES `user_profile` WRITE;
/*!40000 ALTER TABLE `user_profile` DISABLE KEYS */;
INSERT INTO `user_profile` VALUES (6,'01867057600','2000-11-30','O+','Male'),(7,'01766173531','1999-07-06','B+','Male'),(8,'01479651234','1997-08-02','A+','Male'),(9,'01697586413','2000-11-30','AB+','Male'),(10,'01477986458','1973-05-29','O+','Male'),(11,'01697586413','1998-07-17','B+','Male'),(12,'01677894537','1999-07-10','A+','Male'),(13,'01677894537','1996-07-09','AB+','Male'),(14,'01677894537','1999-07-04','B+','Male'),(15,'01477986458','1993-08-15','AB+','Male'),(16,'01477986458','1996-08-15','O+','Male'),(17,'01479651234','1995-07-04','AB+','Male'),(18,'01477986458','1995-06-28','A+','Male'),(19,'01697586413','1994-07-17','A+','Male'),(20,'01677894537','1999-05-29','B+','Male'),(21,'01479651234','1991-06-29','O+','Male'),(22,'01638912345','2003-06-08','B+','Male');
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Minhaz','Kamal','minhaz.kamal9900@gmail.com',NULL,'yes','yes','yes','no','2021-08-09','google'),(7,'Saidul','Islam','saidulislam@ctgmail.com','$2a$10$5EHNT1zc7RyqjQPRHhHAXeV0l0iDLCHQmboHgOHQhIeXcDqZMpTgK','yes','yes','yes','no','2021-08-14','self'),(8,'Anas ','Jawad','anasjawad@ctgmail.com','$2a$10$2bVz1.ApAW2kexix1dVtsOYIDlZU2yMjCLFG90cTKcd/7OSm739l6','yes','yes','yes','no','2021-08-14','self'),(9,'Sartaj','Ekram','sartajekram@ctgmail.com','$2a$10$xJXR.1JJ15vC5PDxVx2OL.P06h8Cw5lf.7e1HBJH7WJ4aDDI0HMx2','yes','yes','yes','no','2021-08-14','self'),(10,'Sajid','Altaf','sajidaltaf@ctgmail.com','$2a$10$oIJ2ie4Ce5bvo2ntqvIXu.euv4k6umGDFAzS9aa7uSukp0r9Rvxne','yes','yes','yes','no','2021-08-14','self'),(11,'Zibran ','Zarif','zibranzarif@ctgmail.com','$2a$10$gIwSkg0AycUncolLZqBS2eDrnbKwv5PbuFi9FEKLmdWMxWEF21fb6','yes','yes','yes','no','2021-08-14','self'),(12,'Anas Azmayeen','Zamee','anaszamee@ctgmail.com','$2a$10$7NAu49kZ9lPezJ/8lMzPVuA3qF3NJpSHu7HCxLuoXbaCxg1O9EW4W','yes','yes','yes','no','2021-08-14','self'),(13,'Raihan','Mahmud','raihanmahmud@ctgmail.com','$2a$10$fCBDWHM6SECAn7iu.ZChSOTPXktYEFC4R8kZR5MkpwDi54D1XnmJm','yes','yes','yes','no','2021-08-14','self'),(14,'Zawad','Chowdhury','zawadchowdhury@ctgmail.com','$2a$10$eddsbEG2zlLDCrCbpdPZ7OE8nfXllfGqg/eUiW5yVVnfvcDorchBq','yes','yes','yes','no','2021-08-14','self'),(15,'Eraj','Chowdhury','eraj@ctgmail.com','$2a$10$jfqEoO/jbdv837HY7VUSae6uo.0lnWwvUKywXEnANJDNOQjqLhxr6','yes','yes','yes','no','2021-08-14','self'),(16,'Najmul','Bari','najmuk@dhkmail.com','$2a$10$l2//I7uxveu/MFKGqAMG3O0BdiGeBgjqwe4a5pD49r7ikrAGxZI5i','yes','yes','yes','no','2021-08-14','self'),(17,'Talha','Chowdhury','talha@dhkmail.com','$2a$10$aYHGv1UULysJEQ8drnf20eVfgzL46BnTMaIKQz5pFYm.UVx18ckJm','yes','yes','yes','no','2021-08-14','self'),(18,'Intiser','Chowdhury','intiser@dhkmail.com','$2a$10$B7sgkFDyp9mVGEWC/X/7YuVDEyI1O5ZR1iEdOwdmzSyNr.kZjOoUW','yes','yes','yes','no','2021-08-14','self'),(19,'Afeef','Ahmed','afeef@dhkmail.com','$2a$10$Xl/qnyVWkzz2buXaVI3T2e.UuNv9Qt5.FsE3cNM1sLcQQf.u6k7L6','yes','yes','yes','no','2021-08-14','self'),(20,'Ifrad','Towhid','ifrad@dhkmail.com','$2a$10$ZWHUgyxpuCLPA7P8g7y2Nut6Q1eqWE266v7moI3/KU5sit.c9CRgO','yes','yes','yes','no','2021-08-14','self'),(21,'Mehdad','Hussain','mehdad@dhkmail.com','$2a$10$e4cewSq926PXBaa2JQekkehjNdZfLyF2puCwgYND8.FJf4vahCotq','yes','yes','yes','no','2021-08-14','self'),(22,'Rayan','Iqbal','rayaniqbalorion@gmail.com','$2a$10$9zS3l34nwm8msQwu0rFRP.LMkznBap/xx5P/7D99ukC2KZ/hyD8Gi','yes','yes','yes','no','2021-08-21','self');
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

-- Dump completed on 2021-08-24  2:14:17
