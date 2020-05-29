import { TestBed } from '@angular/core/testing';

import { DeviceMqttService } from './device-mqtt.service';

describe('DeviceMqttService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceMqttService = TestBed.get(DeviceMqttService);
    expect(service).toBeTruthy();
  });
});
