import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaveInMediabookComponent} from './save-in-mediabook.component';

describe('SaveInMediabookComponent', () => {
  let component: SaveInMediabookComponent;
  let fixture: ComponentFixture<SaveInMediabookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveInMediabookComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveInMediabookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
