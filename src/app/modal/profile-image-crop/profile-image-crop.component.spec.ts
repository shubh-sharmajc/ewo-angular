import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImageCropComponent } from './profile-image-crop.component';

describe('NewComponentComponent', () => {
  let component: ProfileImageCropComponent;
  let fixture: ComponentFixture<ProfileImageCropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileImageCropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImageCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
