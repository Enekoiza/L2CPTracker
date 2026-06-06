-- ============================================================
-- L2 CP Tracker — MySQL schema
-- Matches the EF Core (Pomelo) model. Run once against your server.
-- Charset utf8mb4 / InnoDB. Guid -> char(36), enum -> int,
-- DateTime -> datetime(6), points -> decimal(18,2).
-- ============================================================

CREATE DATABASE IF NOT EXISTS `l2cp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `l2cp`;

-- ---------- members ----------
CREATE TABLE IF NOT EXISTS `members` (
  `Id`           CHAR(36)      NOT NULL,
  `Name`         VARCHAR(50)   NOT NULL,
  `CreatedAtUtc` DATETIME(6)   NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_members_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- contributions ----------
CREATE TABLE IF NOT EXISTS `contributions` (
  `Id`           CHAR(36)        NOT NULL,
  `MemberId`     CHAR(36)        NOT NULL,
  `Type`         INT             NOT NULL,           -- 0 = Material, 1 = Event
  `Points`       DECIMAL(18,2)   NOT NULL,
  `Description`  VARCHAR(255)    NOT NULL,
  `Badge`        VARCHAR(20)     NOT NULL,           -- SOLO | PARTY ÷N | EVENT
  `CreatedAtUtc` DATETIME(6)     NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_contributions_MemberId` (`MemberId`),
  KEY `IX_contributions_CreatedAtUtc` (`CreatedAtUtc`),
  CONSTRAINT `FK_contributions_members_MemberId`
    FOREIGN KEY (`MemberId`) REFERENCES `members` (`Id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- settings (singleton row) ----------
CREATE TABLE IF NOT EXISTS `settings` (
  `Id`      INT  NOT NULL,
  `Divisor` INT  NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`Id`, `Divisor`)
VALUES (1, 1000)
ON DUPLICATE KEY UPDATE `Divisor` = `Divisor`;
