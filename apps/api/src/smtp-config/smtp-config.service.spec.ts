import { BadRequestException } from '@nestjs/common';
import { SmtpProvider } from '@prisma/client';
import { SmtpConfigService } from './smtp-config.service';

describe('SmtpConfigService', () => {
  const previousKey = process.env.APP_ENCRYPTION_KEY;

  beforeAll(() => {
    process.env.APP_ENCRYPTION_KEY = '12345678901234567890123456789012';
  });

  afterAll(() => {
    process.env.APP_ENCRYPTION_KEY = previousKey;
  });

  it('uses Gmail defaults when provider is GMAIL', async () => {
    const prisma = {
      smtpConfig: {
        upsert: jest.fn().mockResolvedValue({
          workspaceId: 'ws_1',
          provider: SmtpProvider.GMAIL,
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          username: 'user@gmail.com',
          password: 'enc:anything',
          fromEmail: 'user@gmail.com',
          fromName: 'Notify',
          isActive: true,
          deletedAt: null,
        }),
      },
    } as any;

    const service = new SmtpConfigService(prisma);
    const result = await service.upsert({
      workspaceId: 'ws_1',
      provider: SmtpProvider.GMAIL,
      username: 'user@gmail.com',
      password: 'app-password',
      fromEmail: 'user@gmail.com',
      fromName: 'Notify',
    });

    expect(prisma.smtpConfig.upsert).toHaveBeenCalled();
    const args = prisma.smtpConfig.upsert.mock.calls[0][0];
    expect(args.update.host).toBe('smtp.gmail.com');
    expect(args.update.port).toBe(587);
    expect(args.update.secure).toBe(false);
    expect(result).not.toHaveProperty('password');
  });

  it('throws for CUSTOM provider without host/port/secure', async () => {
    const prisma = {
      smtpConfig: {
        upsert: jest.fn(),
      },
    } as any;

    const service = new SmtpConfigService(prisma);

    await expect(
      service.upsert({
        workspaceId: 'ws_1',
        provider: SmtpProvider.CUSTOM,
        username: 'user@custom.com',
        password: 'secret',
        fromEmail: 'user@custom.com',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
