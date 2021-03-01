import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProHowItWorksComponent } from './pro-how-it-works.component';

describe('ProHowItWorksComponent', () => {
  let component: ProHowItWorksComponent;
  let fixture: ComponentFixture<ProHowItWorksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProHowItWorksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProHowItWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
