import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicRegistrationComponent} from './basic-registration.component';

describe('BasicRegistrationComponent', () => {
  let component: BasicRegistrationComponent;
  let fixture: ComponentFixture<BasicRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicRegistrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
