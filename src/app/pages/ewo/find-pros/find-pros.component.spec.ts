import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindProsComponent } from './find-pros.component';

describe('ProUserAccountComponent', () => {
  let component: FindProsComponent;
  let fixture: ComponentFixture<FindProsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindProsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindProsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
