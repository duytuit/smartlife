import { TestBed } from '@angular/core/testing';

import { HubMqttService } from './hub-mqtt.service';

describe('HubMqttService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HubMqttService = TestBed.get(HubMqttService);
    expect(service).toBeTruthy();
  });
});
