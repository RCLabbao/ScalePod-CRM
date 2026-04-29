-- WorkflowAction: multi-action support for workflow rules
CREATE TABLE IF NOT EXISTS `WorkflowAction` (
  `id` VARCHAR(191) NOT NULL,
  `ruleId` VARCHAR(191) NOT NULL,
  `type` VARCHAR(191) NOT NULL,
  `config` JSON NOT NULL,
  `order` INT NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  INDEX `WorkflowAction_ruleId_order_idx`(`ruleId`, `order`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint
ALTER TABLE `WorkflowAction` ADD CONSTRAINT `WorkflowAction_ruleId_fkey`
  FOREIGN KEY (`ruleId`) REFERENCES `WorkflowRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing action/actionConfig into WorkflowAction rows
INSERT INTO `WorkflowAction` (`id`, `ruleId`, `type`, `config`, `order`, `active`, `createdAt`, `updatedAt`)
SELECT
  CONCAT('wa_', `id`),
  `id`,
  `action`,
  `actionConfig`,
  0,
  TRUE,
  NOW(),
  NOW()
FROM `WorkflowRule`
WHERE `action` IS NOT NULL AND `action` != 'LEGACY';

-- Make action/actionConfig optional (new rules use WorkflowAction rows instead)
ALTER TABLE `WorkflowRule` MODIFY COLUMN `action` VARCHAR(191) NOT NULL DEFAULT 'LEGACY';
ALTER TABLE `WorkflowRule` MODIFY COLUMN `actionConfig` JSON NULL;