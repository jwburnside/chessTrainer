import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareColorPage } from './square-color.page';

describe('SquareColorPage', () => {
  let component: SquareColorPage;
  let fixture: ComponentFixture<SquareColorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SquareColorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SquareColorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
