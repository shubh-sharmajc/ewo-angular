import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProManageMediaComponent} from './pro-manage-media.component';

describe('ProManageMediaComponent', () => {
  let component: ProManageMediaComponent;
  let fixture: ComponentFixture<ProManageMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProManageMediaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProManageMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
