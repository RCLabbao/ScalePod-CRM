-- Performance indexes for API query speedup
-- These indexes target the most common WHERE and ORDER BY patterns
--
-- NOTE: Uses ALTER TABLE ADD INDEX which is idempotent-safe when
-- the migration runner ignores "duplicate key name" errors.
-- If you already ran `prisma db push`, these indexes may already exist;
-- the runner will skip them gracefully.

-- Lead table: status filter (most common API filter)
ALTER TABLE `Lead` ADD INDEX `Lead_status_idx` (`status`);

-- Lead table: stage filter (pipeline views)
ALTER TABLE `Lead` ADD INDEX `Lead_stage_idx` (`stage`);

-- Lead table: createdAt ordering (all paginated queries sort by this)
ALTER TABLE `Lead` ADD INDEX `Lead_createdAt_idx` (`createdAt`);

-- Lead table: composite index for filtered + ordered queries
ALTER TABLE `Lead` ADD INDEX `Lead_status_createdAt_idx` (`status`, `createdAt`);

-- Lead table: composite index for stage + ordered queries
ALTER TABLE `Lead` ADD INDEX `Lead_stage_createdAt_idx` (`stage`, `createdAt`);

-- StageHistory: always queried by leadId + ordered by changedAt
ALTER TABLE `StageHistory` ADD INDEX `StageHistory_leadId_changedAt_idx` (`leadId`, `changedAt`);