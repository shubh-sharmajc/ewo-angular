import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BasicAccountSetupComponent} from './basic-account-setup.component';

describe('BasicAccountSetupComponent', () => {
  let component: BasicAccountSetupComponent;
  let fixture: ComponentFixture<BasicAccountSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BasicAccountSetupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicAccountSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
