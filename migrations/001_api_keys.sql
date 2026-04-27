-- ── 001: API Key Management Table ───────────────────
-- Stores hashed API keys for external API authentication.
-- Keys are SHA-256 hashed (never stored in plaintext).
-- The prefix column holds the first 12 chars for UI identification.
-- ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `ApiKey` (
  `id`          VARCHAR(191) NOT NULL,
  `name`        VARCHAR(191) NOT NULL,
  `prefix`      VARCHAR(191) NOT NULL,
  `hash`        VARCHAR(191) NOT NULL,
  `scopes`      JSON NOT NULL,
  `tier`        VARCHAR(191) NOT NULL DEFAULT 'FREE',
  `active`      BOOLEAN NOT NULL DEFAULT TRUE,
  `lastUsedAt`  DATETIME(3) NULL,
  `userId`      VARCHAR(191) NOT NULL,
  `createdAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt`   DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`),
  UNIQUE INDEX `ApiKey_hash_key` (`hash`),
  INDEX `ApiKey_userId_idx` (`userId`),

  CONSTRAINT `ApiKey_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;