import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UploadMbItemsComponent} from './upload-mb-items.component';

describe('UploadMbItemsComponent', () => {
  let component: UploadMbItemsComponent;
  let fixture: ComponentFixture<UploadMbItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadMbItemsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMbItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
