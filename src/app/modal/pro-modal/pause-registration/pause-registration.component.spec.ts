import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PauseRegistrationComponent} from './pause-registration.component';

describe('PauseRegistrationComponent', () => {
  let component: PauseRegistrationComponent;
  let fixture: ComponentFixture<PauseRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PauseRegistrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PauseRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
