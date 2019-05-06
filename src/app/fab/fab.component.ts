import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss']
})
export class FabComponent implements OnInit {
  rippleColor = 'rgba(255,166,0,.5)';
  radius = 35;
  controlPanelVisible = true;

  constructor(private data: DataService) {}

  ngOnInit() {}

  toggleMenu() {
    if (this.controlPanelVisible) {
      d3.select('#controlPanel')
        .transition()
        .ease(d3.easeCubicIn)
        .duration(250)
        .style('right', '-500px');
    } else {
      d3.select('#controlPanel')
        .transition()
        .ease(d3.easeCubicIn)
        .duration(200)
        .style('right', '0px');
    }
    this.controlPanelVisible = !this.controlPanelVisible;
  }
}
