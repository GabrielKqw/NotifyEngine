import { Test, TestingModule } from '@nestjs/testing';
import { WorkerModule } from './../src/worker.module';

describe('WorkerModule (e2e)', () => {
  let moduleFixture: TestingModule;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [WorkerModule],
    }).compile();
  });

  it('should compile module', () => {
    expect(moduleFixture).toBeDefined();
  });
});
