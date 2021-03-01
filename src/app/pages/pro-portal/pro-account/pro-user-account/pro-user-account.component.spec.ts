import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUserAccountComponent } from './pro-user-account.component';

describe('ProUserAccountComponent', () => {
  let component: ProUserAccountComponent;
  let fixture: ComponentFixture<ProUserAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUserAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUserAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
