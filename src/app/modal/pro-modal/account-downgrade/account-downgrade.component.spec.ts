import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountDowngradeComponent} from './account-downgrade.component';

describe('AccountDowngradeComponent', () => {
  let component: AccountDowngradeComponent;
  let fixture: ComponentFixture<AccountDowngradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountDowngradeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountDowngradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
