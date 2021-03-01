import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProResourcesComponent } from './pro-resources.component';

describe('ProSignUpComponent', () => {
  let component: ProResourcesComponent;
  let fixture: ComponentFixture<ProResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
