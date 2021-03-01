import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ShareMediaBookComponent} from './share-media-book.component';

describe('ShareMediaBookComponent', () => {
  let component: ShareMediaBookComponent;
  let fixture: ComponentFixture<ShareMediaBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareMediaBookComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareMediaBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
