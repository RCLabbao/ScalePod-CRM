-- Workflow automation rules and execution logs

CREATE TABLE IF NOT EXISTS `WorkflowRule` (
  `id`               VARCHAR(191) NOT NULL,
  `name`             VARCHAR(191) NOT NULL,
  `description`      MEDIUMTEXT NULL,
  `triggerEvent`     VARCHAR(191) NOT NULL,
  `triggerCondition` JSON NULL,
  `action`           VARCHAR(191) NOT NULL,
  `actionConfig`     JSON NOT NULL,
  `active`           BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt`        DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`        DATETIME(3) NOT NULL,

  PRIMARY KEY (`id`),
  INDEX `WorkflowRule_triggerEvent_active_idx` (`triggerEvent`, `active`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `WorkflowLog` (
  `id`        VARCHAR(191) NOT NULL,
  `ruleId`    VARCHAR(191) NOT NULL,
  `leadId`    VARCHAR(191) NULL,
  `success`   BOOLEAN NOT NULL,
  `error`     MEDIUMTEXT NULL,
  `result`    JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  INDEX `WorkflowLog_leadId_createdAt_idx` (`leadId`, `createdAt`),
  INDEX `WorkflowLog_ruleId_createdAt_idx` (`ruleId`, `createdAt`),
  CONSTRAINT `WorkflowLog_ruleId_fkey`
    FOREIGN KEY (`ruleId`) REFERENCES `WorkflowRule`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `WorkflowLog_leadId_fkey`
    FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;