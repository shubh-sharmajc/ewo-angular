import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaBookItemsViewComponent} from './media-book-items-view.component';

describe('MediaBookItemsViewComponent', () => {
  let component: MediaBookItemsViewComponent;
  let fixture: ComponentFixture<MediaBookItemsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaBookItemsViewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBookItemsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
