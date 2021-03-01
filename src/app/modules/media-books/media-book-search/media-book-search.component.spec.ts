import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaBookSearchComponent} from './media-book-search.component';

describe('MediaBookSearchComponent', () => {
  let component: MediaBookSearchComponent;
  let fixture: ComponentFixture<MediaBookSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaBookSearchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBookSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
