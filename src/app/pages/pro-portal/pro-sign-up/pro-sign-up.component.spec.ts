import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSignUpComponent } from './pro-sign-up.component';

describe('ProSignUpComponent', () => {
  let component: ProSignUpComponent;
  let fixture: ComponentFixture<ProSignUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProSignUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
