import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUserReviewProfileComponent } from './pro-user-review-profile.component';

describe('ProUserReviewProfileComponent', () => {
  let component: ProUserReviewProfileComponent;
  let fixture: ComponentFixture<ProUserReviewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUserReviewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUserReviewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
