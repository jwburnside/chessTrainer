import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsmosisPage } from './osmosis.page';

describe('OsmosisPage', () => {
  let component: OsmosisPage;
  let fixture: ComponentFixture<OsmosisPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsmosisPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsmosisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
