CREATE TYPE "SmtpProvider" AS ENUM ('CUSTOM', 'GMAIL');
ALTER TABLE "SmtpConfig" ADD COLUMN "provider" "SmtpProvider" NOT NULL DEFAULT 'CUSTOM';
