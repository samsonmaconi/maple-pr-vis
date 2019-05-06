import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-radarchart',
  templateUrl: './radarchart.component.html',
  styleUrls: ['./radarchart.component.scss']
})
export class RadarchartComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 500;
  svgWidth = 500;
  margin = { top: 40, bottom: 60, left: 70, right: 70 };

  graphHeight = this.svgHeight - this.margin.top - this.margin.bottom;
  graphWidth = this.svgWidth - this.margin.left - this.margin.right;
  radius = Math.min(this.graphWidth / 2, this.graphHeight / 2);

  chartColours = ['#001447', '#ffa600', '#fc0d1b'];
  colorScale = d3
    .scaleOrdinal()
    .range(this.chartColours)
    .domain([0, 2]);

  maxValue;

  levels = 5;
  dataAxes;
  numberOfAxes;
  angleSlice;
  rScale;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.svg = d3
      .select('#radarChart')
      .append('svg')
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth + 250);

    this.initRadarChart();
    this.renderOtherLabels();
  }

  renderOtherLabels() {
    this.svg
      .append('text')
      .attr('x', 620)
      .attr('y', '220')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text('Age Group Distribution Chart')
      .classed('h1 chart-title', true)
      .call(this.wrap, 200);
  }

  initRadarChart() {
    const data: any = [
      [
        { axis: 'Ages 0-14', value: 0 },
        { axis: 'Ages 15-29', value: 0 },
        { axis: 'Ages 30-44', value: 0 },
        { axis: 'Ages 45-59', value: 0 },
        { axis: 'Ages 60-74', value: 0 },
        { axis: 'Ages 75+', value: 0 }
      ]
    ];

    this.maxValue = d3.max(data, i => {
      return d3.max(
        i.map(o => {
          return o.value;
        })
      );
    });

    this.rScale = d3
      .scaleLinear()
      .range([0, this.radius])
      .domain([0, this.maxValue]);

    this.dataAxes = data[0].map(i => i.axis);
    this.numberOfAxes = this.dataAxes.length;
    this.angleSlice = (Math.PI * 2) / this.numberOfAxes;

    const g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' +
          (this.graphWidth / 2 + this.margin.left) +
          ',' +
          (this.graphHeight / 2 + this.margin.top) +
          ')'
      );

    const axisGrid = g.append('g').attr('class', 'axisWrapper');

    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, this.levels + 1).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d, i) => (this.radius / this.levels) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', 0.2);

    // Text indicating at what % each level is
    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, this.levels + 1).reverse())
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => (-d * this.radius) / this.levels)
      .attr('dy', '0.4em')
      .style('font-size', '12px')
      .attr('fill', '#737373')
      .text(d => (((this.maxValue * d) / this.levels) * 100).toFixed(2) + '%');

    const axis = axisGrid
      .selectAll('.axis')
      .data(this.dataAxes)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axis
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr(
        'x2',
        (d, i) =>
          this.rScale(this.maxValue * 1.1) *
          Math.cos(this.angleSlice * i - Math.PI / 2)
      )
      .attr(
        'y2',
        (d, i) =>
          this.rScale(this.maxValue * 1.1) *
          Math.sin(this.angleSlice * i - Math.PI / 2)
      )
      .attr('class', 'line')
      .style('stroke', 'white')
      .style('stroke-width', '2px');

    axis
      .append('text')
      .attr('class', 'legend')
      .style('fill', this.colorScale(0))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr(
        'x',
        (d, i) =>
          this.rScale(this.maxValue * 1) *
          Math.cos(this.angleSlice * i - Math.PI / 2)
      )
      .attr(
        'y',
        (d, i) =>
          this.rScale(this.maxValue * 1) *
          Math.sin(this.angleSlice * i - Math.PI / 2)
      )
      .text(d => d)
      .call(this.wrap, 60);

    const radarLine = d3
      .lineRadial()
      .curve(d3.curveCardinalClosed.tension(0.5))
      .radius(d => this.rScale(d.value))
      .angle((d, i) => i * this.angleSlice);

    // Create a wrapper for the blobs
    const blobWrapper = g
      .selectAll('.radarWrapper')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'radarWrapper');

    // Append the backgrounds
    blobWrapper
      .append('path')
      .attr('class', 'radarArea')
      .attr('d', (d, i) => radarLine(d))
      .style('fill', (d, i) => this.colorScale(2))
      .style('fill-opacity', 0.8);

    // Create the outlines
    blobWrapper
      .append('path')
      .attr('class', 'radarStroke')
      .attr('d', d => radarLine(d))
      .style('stroke-width', 2 + 'px')
      .style('stroke', (d, i) => this.colorScale(0))
      .style('fill', 'none');

    // Append the circles
    blobWrapper
      .selectAll('.radarCircle')
      .data((d, i) => d)
      .enter()
      .append('circle')
      .attr('class', 'radarCircle')
      .attr('r', 4)
      .attr('cx', (d, i) => {
        return (
          this.rScale(d.value) * Math.cos(this.angleSlice * i - Math.PI / 2)
        );
      })
      .attr('cy', (d, i) => {
        return (
          this.rScale(d.value) * Math.sin(this.angleSlice * i - Math.PI / 2)
        );
      })
      .style('fill', (d, i) => this.colorScale(0))
      .style('fill-opacity', 0.8);

    this.subscribeToData();
  }

  async subscribeToData() {
    const myObserver = {
      next: data => {
        this.UpdateRadarChart([data[0]], data[1][0].total_population);
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification')
    };

    await this.data.dataReady;
    this.data.ageGroupRatioData.subscribe(myObserver);
    this.data.provincesChanged.emit();
  }

  UpdateRadarChart(data, totalPop) {
    this.maxValue = d3.max(data, i => {
      return d3.max(
        i.map(o => {
          return o.value;
        })
      );
    });

    this.rScale = d3
      .scaleLinear()
      .range([0, this.radius])
      .domain([0, this.maxValue]);

    const g = this.svg.select('g');

    const axisGrid = g.select('.axisWrapper');

    axisGrid
      .selectAll('.levels')
      .data(d3.range(1, this.levels + 1).reverse())
      .selectAll('.gridCircle')
      .attr('r', (d, i) => (this.radius / this.levels) * d);

    axisGrid
      .selectAll('.axisLabel')
      .data(d3.range(1, this.levels + 1).reverse())
      .attr('y', d => (-d * this.radius) / this.levels)
      .attr('dy', '0.4em')
      .text(d => (((this.maxValue * d) / this.levels) * 100).toFixed(2) + '%');

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis').data(this.dataAxes);

    // Append the lines
    axis
      .select('.line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr(
        'x2',
        (d, i) =>
          this.rScale(this.maxValue * 1.1) *
          Math.cos(this.angleSlice * i - Math.PI / 2)
      )
      .attr(
        'y2',
        (d, i) =>
          this.rScale(this.maxValue * 1.1) *
          Math.sin(this.angleSlice * i - Math.PI / 2)
      );

    // Append the labels at each axis
    axis
      .select('.legend')
      .attr('dy', '0.35em')
      .attr(
        'x',
        (d, i) =>
          this.rScale(this.maxValue * 1.25) *
          Math.cos(this.angleSlice * i - Math.PI / 2)
      )
      .attr(
        'y',
        (d, i) =>
          this.rScale(this.maxValue * 1.25) *
          Math.sin(this.angleSlice * i - Math.PI / 2)
      )
      .text(d => d)
      .call(this.wrap, 60)
      .on('mouseover', (d, i) => {
        d3.select('#infoModal_ageGroup .ageGroup').text(d);
        d3.select('#infoModal_ageGroup .population').text(
          (data[0][i].value * totalPop).toLocaleString()
        );
        d3.select('#infoModal_ageGroup .percentage').text(
          (data[0][i].value * 100).toFixed(3) + '%'
        );
        d3.select('#infoModal_ageGroup').style('visibility', 'visible');
      })
      .on('mouseout', () =>
        d3.select('#infoModal_ageGroup').style('visibility', 'hidden')
      );

    const radarLine = d3
      .lineRadial()
      .curve(d3.curveCardinalClosed.tension(0.5))
      .radius(d => this.rScale(d.value))
      .angle((d, i) => i * this.angleSlice);

    // Create a wrapper for the blobs
    const blobWrapper = g.selectAll('.radarWrapper').data(data);

    blobWrapper
      .selectAll('.radarArea')
      .data(data)
      .transition()
      .delay((d, i) => i * 100)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('d', (d, i) => radarLine(d));

    blobWrapper
      .selectAll('.radarStroke')
      .data(data)
      .transition()
      .delay((d, i) => i * 100)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('d', d => radarLine(d));

    blobWrapper
      .selectAll('.radarCircle')
      .data((d, i) => d)
      .transition()
      .delay((d, i) => i * 100)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('r', 4)
      .attr('cx', (d, i) => {
        return (
          this.rScale(d.value) * Math.cos(this.angleSlice * i - Math.PI / 2)
        );
      })
      .attr('cy', (d, i) => {
        return (
          this.rScale(d.value) * Math.sin(this.angleSlice * i - Math.PI / 2)
        );
      });
  }

  // Modified from http://bl.ocks.org/mbostock/7555321
  // Wraps SVG text
  wrap(text, width) {
    text.each(function() {
      const text = d3.select(this);
      const words = text
        .text()
        .split(/\s+/)
        .reverse();
      let word = [];
      let line = [];
      let lineNumber = 0;
      const lineHeight = 1.4; // ems
      const y = text.attr('y');
      const x = text.attr('x');
      const dy = parseFloat(text.attr('dy'));
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
      word = words.pop();
      while (word) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
        word = words.pop();
      }
    });
  }
}
