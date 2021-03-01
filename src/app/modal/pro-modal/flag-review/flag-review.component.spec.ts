import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlagReviewComponent} from './flag-review.component';

describe('ContactUsComponent', () => {
  let component: FlagReviewComponent;
  let fixture: ComponentFixture<FlagReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FlagReviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
