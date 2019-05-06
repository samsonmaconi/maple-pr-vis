import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedHorizBarChartComponent } from './stacked-horiz-bar-chart.component';

describe('StackedHorizBarChartComponent', () => {
  let component: StackedHorizBarChartComponent;
  let fixture: ComponentFixture<StackedHorizBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedHorizBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedHorizBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
