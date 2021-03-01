import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProAccountComponent} from './pro-account.component';

describe('ProAccountComponent', () => {
  let component: ProAccountComponent;
  let fixture: ComponentFixture<ProAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProAccountComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
