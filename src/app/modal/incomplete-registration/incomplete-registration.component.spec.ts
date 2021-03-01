import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {IncompleteRegistrationComponent} from './incomplete-registration.component';

describe('RegisteredEmailComponent', () => {
  let component: IncompleteRegistrationComponent;
  let fixture: ComponentFixture<IncompleteRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncompleteRegistrationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncompleteRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
