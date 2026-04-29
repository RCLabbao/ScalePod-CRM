-- Scoring rules for attribute-based auto-scoring
-- ScoreConfig gets autoScore toggle
-- New ScoringRule model for configurable matching rules

ALTER TABLE `ScoreConfig` ADD COLUMN `autoScore` BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS `ScoringRule` (
  `id`          VARCHAR(191) NOT NULL,
  `name`        VARCHAR(191) NOT NULL,
  `description` MEDIUMTEXT NULL,
  `fieldType`   VARCHAR(191) NOT NULL,
  `operator`    VARCHAR(191) NOT NULL,
  `value`       MEDIUMTEXT NOT NULL,
  `points`      DOUBLE NOT NULL DEFAULT 0,
  `active`      BOOLEAN NOT NULL DEFAULT TRUE,
  `priority`    INT NOT NULL DEFAULT 0,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `ScoringRule_fieldType_active_idx` (`fieldType`, `active`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;