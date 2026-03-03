CREATE TABLE "SmtpConfig" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "secure" BOOLEAN NOT NULL DEFAULT false,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fromName" TEXT,
    "fromEmail" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SmtpConfig_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SmtpConfig_workspaceId_key" ON "SmtpConfig"("workspaceId");

CREATE INDEX "SmtpConfig_workspaceId_isActive_idx" ON "SmtpConfig"("workspaceId", "isActive");

ALTER TABLE "SmtpConfig" ADD CONSTRAINT "SmtpConfig_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
