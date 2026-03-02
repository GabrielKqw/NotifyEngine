import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EXECUTION_QUEUE } from '../common/queue.constants';
import { AutomationsController } from './automations.controller';
import { AutomationsService } from './automations.service';

@Module({
  imports: [BullModule.registerQueue({ name: EXECUTION_QUEUE })],
  controllers: [AutomationsController],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}
