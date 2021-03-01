import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsersSearchResultComponent} from './users-search-result.component';

describe('UsersSearchResultComponent', () => {
  let component: UsersSearchResultComponent;
  let fixture: ComponentFixture<UsersSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersSearchResultComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
