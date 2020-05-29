import { TestBed } from '@angular/core/testing';

import { MqttSocketService } from './mqtt-socket.service';

describe('MqttSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MqttSocketService = TestBed.get(MqttSocketService);
    expect(service).toBeTruthy();
  });
});
