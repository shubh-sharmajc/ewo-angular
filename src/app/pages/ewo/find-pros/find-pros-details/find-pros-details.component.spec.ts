import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindProsDetailsComponent } from './find-pros-details.component';

describe('ProUserAccountComponent', () => {
  let component: FindProsDetailsComponent;
  let fixture: ComponentFixture<FindProsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindProsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindProsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
