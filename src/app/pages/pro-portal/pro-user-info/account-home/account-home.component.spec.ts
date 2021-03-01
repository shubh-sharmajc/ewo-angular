import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountHomeComponent} from './account-home.component';

describe('AccountSecurityComponent', () => {
  let component: AccountHomeComponent;
  let fixture: ComponentFixture<AccountHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
