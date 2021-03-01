import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkToMediaBookComponent} from './link-to-media-book.component';

describe('CreateMediaBookComponent', () => {
  let component: LinkToMediaBookComponent;
  let fixture: ComponentFixture<LinkToMediaBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkToMediaBookComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkToMediaBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
