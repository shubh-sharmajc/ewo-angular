import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MediaBookItemsComponent} from './media-book-items.component';

describe('MediaBookItemsComponent', () => {
  let component: MediaBookItemsComponent;
  let fixture: ComponentFixture<MediaBookItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaBookItemsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaBookItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
