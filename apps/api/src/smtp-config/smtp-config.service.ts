import { Injectable, NotFoundException } from '@nestjs/common';
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
    const encryptedPassword = encryptSecret(dto.password);

    const config = await this.prisma.smtpConfig.upsert({
      where: { workspaceId: dto.workspaceId },
      update: {
        host: dto.host,
        port: dto.port,
        secure: dto.secure,
        username: dto.username,
        password: encryptedPassword,
        fromName: dto.fromName,
        fromEmail: dto.fromEmail,
        isActive: dto.isActive ?? true,
        deletedAt: null,
      },
      create: {
        workspaceId: dto.workspaceId,
        host: dto.host,
        port: dto.port,
        secure: dto.secure,
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
}
