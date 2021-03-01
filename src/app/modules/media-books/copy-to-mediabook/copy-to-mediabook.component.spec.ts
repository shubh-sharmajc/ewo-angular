import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CopyToMediabookComponent} from './copy-to-mediabook.component';

describe('CopyToMediabookComponent', () => {
  let component: CopyToMediabookComponent;
  let fixture: ComponentFixture<CopyToMediabookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyToMediabookComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyToMediabookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
