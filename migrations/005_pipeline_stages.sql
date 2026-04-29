-- Dynamic pipeline stages
CREATE TABLE IF NOT EXISTS `PipelineStage` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `label` VARCHAR(191) NOT NULL,
  `colorKey` VARCHAR(191) NOT NULL DEFAULT 'slate',
  `position` INT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `PipelineStage_name_key`(`name`),
  PRIMARY KEY (`id`)
);

-- Seed default stages
INSERT IGNORE INTO `PipelineStage` (`id`, `name`, `label`, `colorKey`, `position`, `createdAt`, `updatedAt`) VALUES
  ('stage_sourced',      'SOURCED',       'Sourced',        'slate',   0, NOW(), NOW()),
  ('stage_qualified',    'QUALIFIED',     'Qualified',      'blue',    1, NOW(), NOW()),
  ('stage_first_contact','FIRST_CONTACT','First Contact',  'violet',  2, NOW(), NOW()),
  ('stage_meeting',      'MEETING_BOOKED','Meeting Booked', 'amber',   3, NOW(), NOW()),
  ('stage_proposal',     'PROPOSAL_SENT', 'Proposal Sent', 'orange',  4, NOW(), NOW()),
  ('stage_won',          'CLOSED_WON',    'Closed Won',     'emerald', 5, NOW(), NOW()),
  ('stage_lost',         'CLOSED_LOST',   'Closed Lost',   'red',     6, NOW(), NOW());