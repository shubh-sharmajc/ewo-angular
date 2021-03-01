import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsSearchResultComponent } from './pros-search-result.component';

describe('ProsSearchResultComponent', () => {
  let component: ProsSearchResultComponent;
  let fixture: ComponentFixture<ProsSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProsSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProsSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
