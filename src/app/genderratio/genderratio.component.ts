import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-genderratio',
  templateUrl: './genderratio.component.html',
  styleUrls: ['./genderratio.component.scss']
})
export class GenderratioComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 350;
  svgWidth = 350;

  maleAverage = 0;
  malePopulation = 0;
  femaleAverage = 0;
  femalePopulation = 0;

  metadata;

  colorScale = d3
    .scaleLinear()
    .domain([49, 50, 51])
    .range(['#f48fb1', '#ffa600', '#bbdefb'])
    .clamp(true);

  constructor(private data: DataService) {}

  ngOnInit() {
    this.svg = d3
      .select('#genderDiv')
      .append('svg')
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth);

    this.renderImage();
    this.renderOtherLabels();
    this.subscribeToData();
  }

  renderImage() {
    this.svg
      .append('image')
      .attr('x', '25')
      .attr('y', '40')
      .attr('xlink:href', '../../assets/images/male_female.png')
      .attr('width', '300px')
      .attr('height', '300px');

    d3.select('#genderDiv .clear-glass')
      .on('mouseover', () =>
        d3.select('#infoModal_gender').style('visibility', 'visible')
      )
      .on('mouseout', () =>
        d3.select('#infoModal_gender').style('visibility', 'hidden')
      );
  }

  async subscribeToData() {
    const myObserver = {
      next: data => {
        this.updateGenderChart(data);
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification')
    };

    await this.data.dataReady;
    this.data.genderRatioData.subscribe(myObserver);
    this.data.provincesChanged.emit();
  }

  updateGenderChart(data) {
    if (data[1][0].populationTotal + data[1][1].populationTotal === 0) {
      this.maleAverage = 0;
      this.femaleAverage = 0;
      this.malePopulation = 0;
      this.femalePopulation = 0;
    } else {
      this.malePopulation = data[1][0].populationTotal;
      this.femalePopulation = data[1][1].populationTotal;

      this.maleAverage =
        (this.malePopulation / (this.malePopulation + this.femalePopulation)) *
        100;

      this.femaleAverage =
        (this.femalePopulation /
          (this.malePopulation + this.femalePopulation)) *
        100;
    }

    if (this.maleAverage.toFixed(0) === '100') {
      d3.select('#genderDiv .male')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '2.5em');
    } else {
      d3.select('#genderDiv .male')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '3.2em');
    }

    if (this.femaleAverage.toFixed(0) === '100') {
      d3.select('#genderDiv .female')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '2.5em');
    } else {
      d3.select('#genderDiv .female')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '3.2em');
    }

    d3.select('#genderDiv')
      .transition()
      .ease(d3.easeLinear)
      .duration(1000)
      .style('background-color', this.colorScale(this.maleAverage));
  }

  renderOtherLabels() {
    this.svg
      .append('path')
      .attr('id', 'curveGender')
      .attr('fill', 'transparent')
      .attr('d', 'M151,260 C224,192 323,191 400,258')
      .attr('transform', 'translate(-100, -190)');

    this.svg
      .append('text')
      .append('textPath')
      .attr('xlink:href', '#curveGender')
      .text('Gender Distribution Chart')
      .classed('h1', true);
  }
}
