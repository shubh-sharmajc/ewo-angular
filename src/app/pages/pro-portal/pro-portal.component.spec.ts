import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProPortalComponent } from './pro-portal.component';

describe('ProPortalComponent', () => {
  let component: ProPortalComponent;
  let fixture: ComponentFixture<ProPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
