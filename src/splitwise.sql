SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `User` (
    `email` varchar(100) NOT NULL, 
    `firstName` varchar(100) NOT NULL,
    `lastName` varchar(100) NOT NULL,  
    `password` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Friends` (
    `email1` varchar(100) NOT NULL, 
    `email2` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Transaction` (
    `transactionID` INT NOT NULL AUTO_INCREMENT,
    `paidBy` VARCHAR(100) NOT NULL,
    `paidTo` VARCHAR(100) NOT NULL,
    `description` VARCHAR(100) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `totalAmount` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`transactionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `User`
  ADD PRIMARY KEY (`email`),
  ADD KEY `email` (`email`);

ALTER TABLE `Friends`
  ADD CONSTRAINT Friends UNIQUE(`email1`, `email2`);




