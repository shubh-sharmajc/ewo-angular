import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProListingComponent } from './pro-listing.component';

describe('ProListingComponent', () => {
  let component: ProListingComponent;
  let fixture: ComponentFixture<ProListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
