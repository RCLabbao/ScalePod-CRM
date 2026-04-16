-- ── ScalePod CRM — Database Setup for phpMyAdmin ──────────────
--
-- ╔══════════════════════════════════════════════════════════════╗
-- ║  WARNING: DO NOT RUN THIS ON AN EXISTING DATABASE!          ║
-- ║                                                              ║
-- ║  This file DROPS and RECREATES all tables, wiping ALL data. ║
-- ║  Only use this for a brand-new, empty database.              ║
-- ║                                                              ║
-- ║  For schema changes on an existing database, use the        ║
-- ║  migration system instead:                                   ║
-- ║    → Admin > Settings > Database Migrations                 ║
-- ║    → Add numbered SQL files to the migrations/ folder       ║
-- ╚══════════════════════════════════════════════════════════════╝
--
-- HOW TO USE (NEW DATABASE ONLY):
--   1. cPanel > MySQL Databases → create database + user
--   2. cPanel > phpMyAdmin → select your database
--   3. Click "SQL" tab → paste this entire file → click "Go"
--
-- This creates all tables AND inserts the default admin user.
-- ─────────────────────────────────────────────────────────────

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'AGENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `GmailToken` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `refreshToken` TEXT NOT NULL,
    `accessToken` TEXT NULL,
    `expiryDate` DATETIME(3) NULL,
    `gmailAddress` VARCHAR(191) NULL,
    `lastHistoryId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `GmailToken_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ReferralPartner` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `ReferralPartner_email_key`(`email`),
    UNIQUE INDEX `ReferralPartner_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `LeadImport` (
    `id` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `totalRows` INTEGER NOT NULL DEFAULT 0,
    `importedRows` INTEGER NOT NULL DEFAULT 0,
    `skippedRows` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `columnMapping` JSON NULL,
    `errors` JSON NULL,
    `csvData` LONGTEXT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `contactName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `industry` VARCHAR(191) NULL,
    `estimatedTraffic` VARCHAR(191) NULL,
    `techStack` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `instagram` VARCHAR(191) NULL,
    `twitter` VARCHAR(191) NULL,
    `leadSource` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'INBOX',
    `stage` VARCHAR(191) NOT NULL DEFAULT 'SOURCED',
    `temperature` VARCHAR(191) NOT NULL DEFAULT 'COLD',
    `score` DOUBLE NOT NULL DEFAULT 0,
    `maxScore` DOUBLE NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `referralPartnerId` VARCHAR(191) NULL,
    `importId` VARCHAR(191) NULL,
    `scraperJobId` VARCHAR(191) NULL,
    `createdById` VARCHAR(191) NULL,
    `approvedById` VARCHAR(191) NULL,
    `rejectedById` VARCHAR(191) NULL,
    `assignedToId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `Lead_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `StageHistory` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `fromStage` VARCHAR(191) NULL,
    `toStage` VARCHAR(191) NOT NULL,
    `changedById` VARCHAR(191) NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ActivityLog` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `ActivityLog_leadId_createdAt_idx`(`leadId`, `createdAt`),
    INDEX `ActivityLog_userId_createdAt_idx`(`userId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `EmailThread` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `gmailThreadId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `snippet` TEXT NULL,
    `lastMessage` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'SENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `EmailThread_gmailThreadId_key`(`gmailThreadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `EmailMessage` (
    `id` VARCHAR(191) NOT NULL,
    `threadId` VARCHAR(191) NOT NULL,
    `gmailMessageId` VARCHAR(191) NOT NULL,
    `fromAddress` VARCHAR(191) NULL,
    `toAddress` TEXT NULL,
    `subject` VARCHAR(191) NULL,
    `bodyPlain` LONGTEXT NULL,
    `bodyHtml` LONGTEXT NULL,
    `snippet` TEXT NULL,
    `labelIds` JSON NULL,
    `direction` VARCHAR(191) NOT NULL DEFAULT 'received',
    `readAt` DATETIME(3) NULL,
    `sentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `EmailMessage_gmailMessageId_key`(`gmailMessageId`),
    INDEX `EmailMessage_threadId_idx`(`threadId`),
    INDEX `EmailMessage_direction_idx`(`direction`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `EmailTemplate` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `VerificationCriteria` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'YES_NO',
    `weight` INTEGER NOT NULL DEFAULT 1,
    `required` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `LeadVerification` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `criteriaId` VARCHAR(191) NOT NULL,
    `verifiedBy` VARCHAR(191) NULL,
    `response` TEXT NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `LeadVerification_leadId_criteriaId_key`(`leadId`, `criteriaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ScoreConfig` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'default',
    `hotThreshold` DOUBLE NOT NULL DEFAULT 80,
    `warmThreshold` DOUBLE NOT NULL DEFAULT 50,
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CaptureForm` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `fields` JSON NOT NULL,
    `redirectUrl` VARCHAR(191) NULL,
    `autoScore` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `CaptureForm_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CaptureFormSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `formId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `data` JSON NOT NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ChatbotConfig` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `welcomeMessage` VARCHAR(191) NOT NULL DEFAULT 'Hi! How can we help you?',
    `questions` JSON NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `ChatbotConfig_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ChatbotConversation` (
    `id` VARCHAR(191) NOT NULL,
    `chatbotId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `answers` JSON NOT NULL,
    `completedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TrackingSite` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `TrackingSite_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `TrackingVisit` (
    `id` VARCHAR(191) NOT NULL,
    `siteId` VARCHAR(191) NOT NULL,
    `pageUrl` VARCHAR(191) NOT NULL,
    `pageTitle` VARCHAR(191) NULL,
    `referrer` VARCHAR(191) NULL,
    `ip` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `sessionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `TrackingVisit_siteId_createdAt_idx`(`siteId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `WebhookConfig` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL DEFAULT 'GENERIC',
    `fieldMapping` JSON NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `secret` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    UNIQUE INDEX `WebhookConfig_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `WebhookLog` (
    `id` VARCHAR(191) NOT NULL,
    `webhookId` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `payload` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'RECEIVED',
    `error` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `ScraperJob` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `discoveryMode` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `totalDiscovered` INTEGER NOT NULL DEFAULT 0,
    `totalValid` INTEGER NOT NULL DEFAULT 0,
    `totalEnriched` INTEGER NOT NULL DEFAULT 0,
    `totalImported` INTEGER NOT NULL DEFAULT 0,
    `totalSkipped` INTEGER NOT NULL DEFAULT 0,
    `totalFailed` INTEGER NOT NULL DEFAULT 0,
    `discoveredUrls` JSON NULL,
    `serpApiQueries` JSON NULL,
    `uploadedUrls` LONGTEXT NULL,
    `errors` JSON NULL,
    `config` JSON NULL,
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys
ALTER TABLE `GmailToken` ADD CONSTRAINT `GmailToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_referralPartnerId_fkey` FOREIGN KEY (`referralPartnerId`) REFERENCES `ReferralPartner`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_importId_fkey` FOREIGN KEY (`importId`) REFERENCES `LeadImport`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_rejectedById_fkey` FOREIGN KEY (`rejectedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `StageHistory` ADD CONSTRAINT `StageHistory_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `StageHistory` ADD CONSTRAINT `StageHistory_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ActivityLog` ADD CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `EmailThread` ADD CONSTRAINT `EmailThread_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `EmailMessage` ADD CONSTRAINT `EmailMessage_threadId_fkey` FOREIGN KEY (`threadId`) REFERENCES `EmailThread`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `LeadVerification` ADD CONSTRAINT `LeadVerification_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `LeadVerification` ADD CONSTRAINT `LeadVerification_criteriaId_fkey` FOREIGN KEY (`criteriaId`) REFERENCES `VerificationCriteria`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `LeadVerification` ADD CONSTRAINT `LeadVerification_verifiedBy_fkey` FOREIGN KEY (`verifiedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `CaptureFormSubmission` ADD CONSTRAINT `CaptureFormSubmission_formId_fkey` FOREIGN KEY (`formId`) REFERENCES `CaptureForm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CaptureFormSubmission` ADD CONSTRAINT `CaptureFormSubmission_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ChatbotConversation` ADD CONSTRAINT `ChatbotConversation_chatbotId_fkey` FOREIGN KEY (`chatbotId`) REFERENCES `ChatbotConfig`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `ChatbotConversation` ADD CONSTRAINT `ChatbotConversation_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `TrackingVisit` ADD CONSTRAINT `TrackingVisit_siteId_fkey` FOREIGN KEY (`siteId`) REFERENCES `TrackingSite`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `WebhookLog` ADD CONSTRAINT `WebhookLog_webhookId_fkey` FOREIGN KEY (`webhookId`) REFERENCES `WebhookConfig`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `WebhookLog` ADD CONSTRAINT `WebhookLog_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `LeadImport` ADD CONSTRAINT `LeadImport_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_scraperJobId_fkey` FOREIGN KEY (`scraperJobId`) REFERENCES `ScraperJob`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `ScraperJob` ADD CONSTRAINT `ScraperJob_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- ── Seed Data: Admin User (password: admin123) ───────────────
-- Change this password immediately after first login!

INSERT INTO `User` (`id`, `email`, `passwordHash`, `name`, `role`, `createdAt`, `updatedAt`)
VALUES ('clxadmin00000000001', 'admin@scalepod.com', '$2a$12$q5sogB1YhOzzx8RlEHDLNeJDxihjBoDixsUBddi8.hY86D.GEm.Da', 'Admin', 'ADMIN', NOW(3), NOW(3));

-- ── Seed Data: Email Templates ───────────────────────────────
INSERT INTO `EmailTemplate` (`id`, `name`, `subject`, `body`, `createdAt`, `updatedAt`)
VALUES (
  'template-cold-outreach', 'Cold Outreach',
  'Helping {{company_name}} grow with digital marketing',
  'Hi {{contact_name}},\n\nI came across {{company_name}} and was really impressed by what you''re doing in the {{industry}} space.\n\nI''d love to share some ideas on how we could help boost your online presence and drive more qualified traffic to your website.\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards',
  NOW(3), NOW(3)
);

INSERT INTO `EmailTemplate` (`id`, `name`, `subject`, `body`, `createdAt`, `updatedAt`)
VALUES (
  'template-follow-up', 'Follow Up',
  'Following up — {{company_name}}',
  'Hi {{contact_name}},\n\nI reached out last week about potentially helping {{company_name}} scale your digital marketing efforts.\n\nI understand you''re busy, so I''ll keep this brief — would any of these times work for a quick chat?\n\n- Tuesday 2-4 PM\n- Wednesday 10 AM - 12 PM\n- Thursday 3-5 PM\n\nLooking forward to connecting.',
  NOW(3), NOW(3)
);

-- ── Seed Data: Verification Criteria ─────────────────────────
INSERT INTO `VerificationCriteria` (`id`, `name`, `description`, `type`, `weight`, `required`, `sortOrder`, `active`, `createdAt`, `updatedAt`) VALUES
('criteria-valid-website', 'Valid Website', 'Does the company have a functional website with real content?', 'YES_NO', 2, true, 0, true, NOW(3), NOW(3)),
('criteria-business-email', 'Business Email', 'Is the contact using a business/domain email (not Gmail, Yahoo, etc.)?', 'YES_NO', 2, true, 1, true, NOW(3), NOW(3)),
('criteria-industry-fit', 'Industry Fit', 'Does this company match our target industries?', 'SCORE', 3, true, 2, true, NOW(3), NOW(3)),
('criteria-website-traffic', 'Website Traffic', 'How much estimated monthly traffic does the site receive?', 'SCORE', 2, false, 3, true, NOW(3), NOW(3)),
('criteria-decision-maker', 'Decision Maker Identified', 'Do we have the name and role of a decision-maker?', 'YES_NO', 3, true, 4, true, NOW(3), NOW(3)),
('criteria-competitor-analysis', 'Competitor Analysis', 'Notes on what marketing tools/competitors they currently use', 'TEXT', 1, false, 5, true, NOW(3), NOW(3));
