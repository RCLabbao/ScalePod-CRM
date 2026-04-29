-- Performance indexes for API query speedup
-- These indexes target the most common WHERE and ORDER BY patterns

-- Lead table: status filter (most common API filter)
CREATE INDEX IF NOT EXISTS `Lead_status_idx` ON `Lead` (`status`);

-- Lead table: stage filter (pipeline views)
CREATE INDEX IF NOT EXISTS `Lead_stage_idx` ON `Lead` (`stage`);

-- Lead table: createdAt ordering (all paginated queries sort by this)
CREATE INDEX IF NOT EXISTS `Lead_createdAt_idx` ON `Lead` (`createdAt`);

-- Lead table: composite index for filtered + ordered queries
CREATE INDEX IF NOT EXISTS `Lead_status_createdAt_idx` ON `Lead` (`status`, `createdAt`);

-- Lead table: composite index for stage + ordered queries
CREATE INDEX IF NOT EXISTS `Lead_stage_createdAt_idx` ON `Lead` (`stage`, `createdAt`);

-- StageHistory: always queried by leadId + ordered by changedAt
CREATE INDEX IF NOT EXISTS `StageHistory_leadId_changedAt_idx` ON `StageHistory` (`leadId`, `changedAt`);