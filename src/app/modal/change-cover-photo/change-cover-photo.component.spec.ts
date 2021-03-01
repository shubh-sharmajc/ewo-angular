import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCoverPhotoComponent } from './change-cover-photo.component';

describe('ChangeCoverPhotoComponent', () => {
  let component: ChangeCoverPhotoComponent;
  let fixture: ComponentFixture<ChangeCoverPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeCoverPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCoverPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
