import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './common/prisma.module';
import { HealthController } from './health.controller';
import { AutomationsModule } from './automations/automations.module';
import { ExecutionsModule } from './executions/executions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    PrismaModule,
    AutomationsModule,
    ExecutionsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class ApiModule {}
