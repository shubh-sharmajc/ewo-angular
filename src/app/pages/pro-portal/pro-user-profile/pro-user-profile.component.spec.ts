import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUserProfileComponent } from './pro-user-profile.component';

describe('ProUserProfileComponent', () => {
  let component: ProUserProfileComponent;
  let fixture: ComponentFixture<ProUserProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUserProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
