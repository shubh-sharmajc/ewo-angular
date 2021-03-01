import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisteredEmailComponent} from './registered-email.component';

describe('RegisteredEmailComponent', () => {
  let component: RegisteredEmailComponent;
  let fixture: ComponentFixture<RegisteredEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisteredEmailComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
