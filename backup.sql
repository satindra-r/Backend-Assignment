-- MySQL dump 10.13  Distrib 8.4.5, for Linux (x86_64)
--
-- Host: localhost    Database: ChefDB
-- ------------------------------------------------------
-- Server version	8.4.5

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Dishes`
--

DROP TABLE IF EXISTS `Dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dishes` (
  `DishId` int NOT NULL,
  `ItemId` int DEFAULT NULL,
  `OrderId` int DEFAULT NULL,
  `DishCount` int DEFAULT NULL,
  `SplInstructions` text,
  `Prepared` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`DishId`),
  KEY `OrderId` (`OrderId`),
  KEY `ItemId` (`ItemId`),
  CONSTRAINT `Dishes_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`OrderId`),
  CONSTRAINT `Dishes_ibfk_2` FOREIGN KEY (`ItemId`) REFERENCES `Items` (`ItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dishes`
--

LOCK TABLES `Dishes` WRITE;
/*!40000 ALTER TABLE `Dishes` DISABLE KEYS */;
INSERT INTO `Dishes` VALUES (1,1,1,2,'1',1),(2,2,1,2,'5',1),(3,3,1,2,'9',1),(4,4,1,2,'2',0),(5,5,1,2,'3',0),(6,6,1,2,'6',0),(7,7,1,2,'4',0),(8,8,1,2,'7',0),(9,9,1,2,'8',0),(10,10,1,2,'10',0),(11,11,1,5,'12',0),(12,12,1,5,'12324',0),(13,1,2,10000000,'',1),(14,4,2,1,'',0),(15,1,3,3,'',0),(16,5,3,3,'',0),(17,6,3,6,'',1),(18,1,4,5,'',0),(19,7,4,923,'',1),(20,1,5,3,'',0),(21,4,5,9,'gg',0),(22,7,5,9,'',0),(23,10,6,1,'',0);
/*!40000 ALTER TABLE `Dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Items`
--

DROP TABLE IF EXISTS `Items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Items` (
  `ItemId` int NOT NULL,
  `ItemName` varchar(255) DEFAULT NULL,
  `SectionId` int DEFAULT NULL,
  `Price` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`ItemId`),
  KEY `SectionId` (`SectionId`),
  CONSTRAINT `Items_ibfk_1` FOREIGN KEY (`SectionId`) REFERENCES `Sections` (`SectionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Items`
--

LOCK TABLES `Items` WRITE;
/*!40000 ALTER TABLE `Items` DISABLE KEYS */;
INSERT INTO `Items` VALUES (1,'Spring Roll',1,120),(2,'Naan',2,40),(3,'Chocolate Ice Cream',3,60),(4,'Momos',1,230),(5,'Paneer',1,360),(6,'Roti',2,150),(7,'Kebab',1,230),(8,'Kulcha',2,30),(9,'Phulka',2,20),(10,'Vannila Ice Cream',3,60),(11,'Mango Ice Cream',3,60),(12,'Mixed Ice Cream',3,10);
/*!40000 ALTER TABLE `Items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Orders` (
  `OrderId` int NOT NULL,
  `UserId` int DEFAULT NULL,
  `Price` decimal(10,0) DEFAULT NULL,
  `Paid` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`OrderId`),
  KEY `UserId` (`UserId`),
  CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `Users` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,1,2950,1),(2,1,1200000230,1),(3,4,2340,1),(4,4,212890,1),(5,4,4500,1),(6,4,60,1);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sections`
--

DROP TABLE IF EXISTS `Sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sections` (
  `SectionId` int NOT NULL,
  `SectionName` varchar(255) DEFAULT NULL,
  `SectionOrder` int DEFAULT NULL,
  PRIMARY KEY (`SectionId`),
  UNIQUE KEY `SectionOrder` (`SectionOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sections`
--

LOCK TABLES `Sections` WRITE;
/*!40000 ALTER TABLE `Sections` DISABLE KEYS */;
INSERT INTO `Sections` VALUES (1,'Appetizers',1),(2,'Main Course',2),(3,'Dessert',3);
/*!40000 ALTER TABLE `Sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `UserId` int NOT NULL,
  `UserName` varchar(255) DEFAULT NULL,
  `Role` enum('User','Chef','Admin') DEFAULT NULL,
  `PhoneNo` varchar(10) DEFAULT NULL,
  `Address` varchar(511) DEFAULT NULL,
  `Hash` binary(64) DEFAULT NULL,
  PRIMARY KEY (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'user1','User','1234567890','here',0xC3DD00F6369F899294A5BAFBEC7A9CC4C113673932E171DA932CEE110C04F44E60EFBFBDEFBFBDEFBFBDEFBFBDEFBFBD30EFBFBD52EFBFBD28EFBFBDEFBFBD21),(2,'chef','Chef','1234567890','#1',0xC3DD00F6369F899294A5BAFBEC7A9CC4C113673932E171DA932CEE110C04F44E60EFBFBDEFBFBDEFBFBDEFBFBDEFBFBD30EFBFBD52EFBFBD28EFBFBDEFBFBD21),(3,'admin','Admin','1234567890','#1',0xC3DD00F6369F899294A5BAFBEC7A9CC4C113673932E171DA932CEE110C04F44E60EFBFBDEFBFBDEFBFBDEFBFBDEFBFBD30EFBFBD52EFBFBD28EFBFBDEFBFBD21),(4,'user2','User','1234567890','#2',0xC3DD00F6369F899294A5BAFBEC7A9CC4C113673932E171DA932CEE110C04F44E60EFBFBDEFBFBDEFBFBDEFBFBDEFBFBD30EFBFBD52EFBFBD28EFBFBDEFBFBD21);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-21  9:29:41
