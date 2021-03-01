import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddLocationsComponent} from './add-locations.component';

describe('AccountSecurityComponent', () => {
  let component: AddLocationsComponent;
  let fixture: ComponentFixture<AddLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
