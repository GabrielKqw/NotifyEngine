import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SmtpProvider } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { UpsertSmtpConfigDto } from './dto/upsert-smtp-config.dto';
import { SendTestEmailDto } from './dto/send-test-email.dto';
import * as nodemailer from 'nodemailer';
import { decryptSecret, encryptSecret } from '../../../../libs/shared/src/secret.util';

@Injectable()
export class SmtpConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async getByWorkspace(workspaceId: string) {
    const config = await this.prisma.smtpConfig.findUnique({
      where: { workspaceId },
    });

    if (!config || config.deletedAt) {
      return null;
    }

    return this.sanitize(config);
  }

  async upsert(dto: UpsertSmtpConfigDto) {
    const provider = dto.provider ?? SmtpProvider.CUSTOM;
    const smtpSettings = this.resolveSmtpSettings(provider, dto.host, dto.port, dto.secure);
    const encryptedPassword = encryptSecret(dto.password);

    const config = await this.prisma.smtpConfig.upsert({
      where: { workspaceId: dto.workspaceId },
      update: {
        provider,
        host: smtpSettings.host,
        port: smtpSettings.port,
        secure: smtpSettings.secure,
        username: dto.username,
        password: encryptedPassword,
        fromName: dto.fromName,
        fromEmail: dto.fromEmail,
        isActive: dto.isActive ?? true,
        deletedAt: null,
      },
      create: {
        workspaceId: dto.workspaceId,
        provider,
        host: smtpSettings.host,
        port: smtpSettings.port,
        secure: smtpSettings.secure,
        username: dto.username,
        password: encryptedPassword,
        fromName: dto.fromName,
        fromEmail: dto.fromEmail,
        isActive: dto.isActive ?? true,
      },
    });

    return this.sanitize(config);
  }

  async sendTestEmail(dto: SendTestEmailDto) {
    const config = await this.prisma.smtpConfig.findUnique({
      where: { workspaceId: dto.workspaceId },
    });

    if (!config || config.deletedAt || !config.isActive) {
      throw new NotFoundException('Active SMTP config not found for workspace');
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.username,
        pass: decryptSecret(config.password),
      },
    });

    await transporter.verify();
    const result = await transporter.sendMail({
      from: config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail,
      to: dto.to,
      subject: dto.subject ?? 'Notify SMTP test',
      text: 'SMTP configuration test sent by Notify.',
    });

    return {
      accepted: result.accepted,
      rejected: result.rejected,
      messageId: result.messageId,
    };
  }

  private sanitize<T extends { password: string }>(config: T): Omit<T, 'password'> {
    const { password: _password, ...safe } = config;
    return safe;
  }

  private resolveSmtpSettings(
    provider: SmtpProvider,
    host?: string,
    port?: number,
    secure?: boolean,
  ): { host: string; port: number; secure: boolean } {
    if (provider === SmtpProvider.GMAIL) {
      return {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
      };
    }

    if (!host || !port || secure == null) {
      throw new BadRequestException('CUSTOM provider requires host, port and secure');
    }

    return { host, port, secure };
  }
}
