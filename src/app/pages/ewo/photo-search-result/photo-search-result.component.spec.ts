import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PhotoSearchResultComponent} from './photo-search-result.component';

describe('PhotoSearchResultComponent', () => {
  let component: PhotoSearchResultComponent;
  let fixture: ComponentFixture<PhotoSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoSearchResultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
