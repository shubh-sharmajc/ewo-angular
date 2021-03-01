import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaBooksComponent} from './media-books.component';

describe('MediaBooksComponent', () => {
  let component: MediaBooksComponent;
  let fixture: ComponentFixture<MediaBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaBooksComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
