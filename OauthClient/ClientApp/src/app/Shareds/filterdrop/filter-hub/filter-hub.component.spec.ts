import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterHubComponent } from './filter-hub.component';

describe('FilterHubComponent', () => {
  let component: FilterHubComponent;
  let fixture: ComponentFixture<FilterHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
