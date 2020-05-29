import { TestBed } from '@angular/core/testing';

import { UserHubService } from './user-hub.service';

describe('UserHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserHubService = TestBed.get(UserHubService);
    expect(service).toBeTruthy();
  });
});
