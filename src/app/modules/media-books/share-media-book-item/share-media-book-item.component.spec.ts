import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareMediaBookItemComponent} from './share-media-book-item.component';

describe('ShareMediaBookItemComponent', () => {
  let component: ShareMediaBookItemComponent;
  let fixture: ComponentFixture<ShareMediaBookItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareMediaBookItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMediaBookItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
