import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EWOComponent} from './ewo.component';

describe('EWOComponent', () => {
  let component: EWOComponent;
  let fixture: ComponentFixture<EWOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EWOComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EWOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
