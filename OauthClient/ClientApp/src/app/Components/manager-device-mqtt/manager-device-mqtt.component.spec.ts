import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDeviceMqttComponent } from './manager-device-mqtt.component';

describe('ManagerDeviceMqttComponent', () => {
  let component: ManagerDeviceMqttComponent;
  let fixture: ComponentFixture<ManagerDeviceMqttComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerDeviceMqttComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDeviceMqttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
