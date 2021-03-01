import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FinalizeProfileComponent} from './finalize-profile.component';

describe('FinalizeProfileComponent', () => {
  let component: FinalizeProfileComponent;
  let fixture: ComponentFixture<FinalizeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinalizeProfileComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalizeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
