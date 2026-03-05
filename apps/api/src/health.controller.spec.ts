import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok status', () => {
    const controller = new HealthController();
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('notify-api');
    expect(typeof result.timestamp).toBe('string');
  });
});
