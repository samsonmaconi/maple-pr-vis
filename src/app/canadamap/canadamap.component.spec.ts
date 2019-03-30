import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanadamapComponent } from './canadamap.component';

describe('CanadamapComponent', () => {
  let component: CanadamapComponent;
  let fixture: ComponentFixture<CanadamapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanadamapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanadamapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
