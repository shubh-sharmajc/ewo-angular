import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProUserViewProfileComponent } from './pro-user-view-profile.component';

describe('ProUserViewProfileComponent', () => {
  let component: ProUserViewProfileComponent;
  let fixture: ComponentFixture<ProUserViewProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProUserViewProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProUserViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
