import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RatingsAndReviewsComponent} from './ratings-and-reviews.component';

describe('RatingsAndReviewsComponent', () => {
  let component: RatingsAndReviewsComponent;
  let fixture: ComponentFixture<RatingsAndReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingsAndReviewsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingsAndReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
