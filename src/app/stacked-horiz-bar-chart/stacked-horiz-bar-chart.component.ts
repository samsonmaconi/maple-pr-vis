import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-stacked-horiz-bar-chart',
  templateUrl: './stacked-horiz-bar-chart.component.html',
  styleUrls: ['./stacked-horiz-bar-chart.component.scss']
})
export class StackedHorizBarChartComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 400;
  svgWidth = '100%';
  graphHeight = 400;
  graphWidth = 750;
  provincesGroup;
  mapColours = ['#001447', '#6a1b9a', '#ff5e00', '#c81400'];
  colorScale = d3
    .scaleOrdinal()
    .domain([1, 2, 3, 4])
    .range(this.mapColours);

  margin = { top: 180, bottom: 20, left: 50, right: 30 };
  innerWidth = this.graphWidth - this.margin.left - this.margin.right;
  innerHeight = this.graphHeight - this.margin.top - this.margin.bottom;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.svg = d3
      .select('#stackedHorizChart')
      .append('svg')
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth);

    this.initChart([], this.svg, 0, 0);
    this.renderOtherLabels();
  }

  renderOtherLabels() {
    this.svg
      .append('text')
      .attr('x', 150)
      .attr('y', '100')
      .text('PR Immigrants Quarter on Quarter Inflow')
      .classed('h1 chart-title', true);

    let g = this.svg.append('g');

    g.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', '13px')
      .attr('height', '13px')
      .style('fill', this.colorScale(1));

    g.append('text')
      .attr('x', 15)
      .attr('y', 11)
      .text('Q1')
      .classed('legend', true);

    g.append('rect')
      .attr('x', 100)
      .attr('y', 0)
      .attr('width', '13px')
      .attr('height', '13px')
      .style('fill', this.colorScale(2));

    g.append('text')
      .attr('x', 115)
      .attr('y', 11)
      .text('Q2')
      .classed('legend', true);

    g.append('rect')
      .attr('x', 200)
      .attr('y', 0)
      .attr('width', '13px')
      .attr('height', '13px')
      .style('fill', this.colorScale(3));

    g.append('text')
      .attr('x', 215)
      .attr('y', 11)
      .text('Q3')
      .classed('legend', true);

    g.append('rect')
      .attr('x', 300)
      .attr('y', 0)
      .attr('width', '13px')
      .attr('height', '13px')
      .style('fill', this.colorScale(4));

    g.append('text')
      .attr('x', 315)
      .attr('y', 11)
      .text('Q4')
      .classed('legend', true);

    g.attr('transform', `translate(200,150)`);
  }

  initChart(data, svg, xscale_upperbound, xaxis_ticks) {
    const xScale = d3
      .scaleLinear()
      .domain([0, xscale_upperbound])
      .range([0, this.innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.year))
      .range([0, this.innerHeight])
      .padding(0.1);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(0)
      .tickPadding(10);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(1)
      .tickPadding(10);

    const g = svg
      .append('g')
      .classed('main', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    g.append('g')
      .classed('y-axis domain_hidden', true)
      .call(yAxis);

    g.append('g')
      .classed('x-axis domain_hidden', true)
      .call(xAxis)
      .attr('transform', `translate(0,${this.innerHeight})`);

    this.subscribeToData();
  }

  async subscribeToData() {
    await this.data.dataReady;

    this.data.qoqPopulationData.subscribe(
      data => {
        this.updateChart(
          data[0],
          this.svg,
          data[1].populationMax,
          0,
          data[1].yearsCount,
          data[1].populationTotal
        );
      },
      error => console.error('There was an error retrieving the data', error),
      () => console.log('Data retrieved!')
    );

    this.data.updateQoqHorizBarchart.emit();
  }

  updateChart(
    data,
    svg,
    xscale_upperbound,
    xaxis_ticks,
    yearsCount,
    populationTotal
  ) {
    this.graphHeight = this.margin.top + this.margin.bottom + yearsCount * 50;
    this.innerHeight = this.graphHeight - this.margin.top - this.margin.bottom;
    this.svgHeight = this.graphHeight;
    this.svg.attr('height', this.svgHeight);

    const xScale = d3
      .scaleLinear()
      .domain([0, xscale_upperbound])
      .range([0, this.innerWidth]);

    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.year))
      .range([0, this.innerHeight])
      .padding(0.3);

    const yAxis = d3
      .axisLeft(yScale)
      .tickSize(5)
      .tickPadding(5);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10);

    svg
      .select('g.y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-weight', 'bold')
      .style('fill', 'rgb(0, 20, 71)');

    svg
      .select('g.x-axis')
      .call(xAxis)
      .selectAll('text')
      .remove();

    const itemGroup = svg
      .select('g.main')
      .selectAll('.g_itemGroup')
      .data(data)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    const newItemGroup = itemGroup
      .enter()
      .append('g')
      .classed('g_itemGroup', true)
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut);

    itemGroup.exit().remove();

    newItemGroup.append('rect').classed('Q1', true);
    newItemGroup.append('rect').classed('Q2', true);
    newItemGroup.append('rect').classed('Q3', true);
    newItemGroup.append('rect').classed('Q4', true);

    newItemGroup.append('text');

    svg
      .selectAll('.g_itemGroup')
      .select('text')
      .classed('barLabels', true)
      .transition()
      .delay((d, i) => 500 + i * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('x', d => xScale(d.total) + 5)
      .attr('y', d => yScale(d.year) + yScale.bandwidth() / 2)
      .attr('text-anchor', 'start')
      .text(d => d.total.toLocaleString());

    svg
      .selectAll('.g_itemGroup')
      .select('rect.Q1')
      .transition()
      .delay((d, i) => (20 - i) * 50)
      .ease(d3.easeLinear)
      .duration(500)
      // .on('interrupt', function() {
      //   d3.select(this)
      //     .attr('x', (d, i) => xScale(d.country))
      //     .attr(
      //       'y',
      //       d => _this.innerHeight - (yScale(0) - yScale(d.population))
      //     )
      //     .attr('width', xScale.bandwidth)
      //     .attr('height', d => yScale(0) - yScale(d.population))
      //     .attr(
      //       'fill',
      //       (d, i) => `rgb(${10 * (data.length - i)}, 20, ${7 * i})`
      //     );
      // })
      .attr('x', (d, i) => xScale(0))
      .attr('y', d => yScale(d.year))
      .attr('width', d => xScale(d.quarter.Q1))
      .attr('height', yScale.bandwidth)
      .attr('fill', this.colorScale(1));

    svg
      .selectAll('.g_itemGroup')
      .select('rect.Q2')
      .transition()
      .delay((d, i) => (20 - i) * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('x', (d, i) => xScale(d.quarter.Q1 ? d.quarter.Q1 : 0))
      .attr('y', d => yScale(d.year))
      .attr('width', d => xScale(d.quarter.Q2))
      .attr('height', yScale.bandwidth)
      .attr('fill', this.colorScale(2));

    svg
      .selectAll('.g_itemGroup')
      .select('rect.Q3')
      .transition()
      .delay((d, i) => (20 - i) * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('x', (d, i) =>
        xScale(
          (d.quarter.Q1 ? d.quarter.Q1 : 0) + (d.quarter.Q2 ? d.quarter.Q2 : 0)
        )
      )
      .attr('y', d => yScale(d.year))
      .attr('width', d => xScale(d.quarter.Q3))
      .attr('height', yScale.bandwidth)
      .attr('fill', this.colorScale(3));

    svg
      .selectAll('.g_itemGroup')
      .select('rect.Q4')
      .transition()
      .delay((d, i) => (20 - i) * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .attr('x', (d, i) => xScale(d.total - d.quarter.Q4))
      .attr('y', d => yScale(d.year))
      .attr('width', d => xScale(d.quarter.Q4))
      .attr('height', yScale.bandwidth)
      .attr('fill', this.colorScale(4));

    function onMouseOver(d) {
      d3.select('#infoModal_qoqPopulation').style('visibility', 'visible');

      d3.select('#infoModal_qoqPopulation .year').text(d.year);
      d3.select('#infoModal_qoqPopulation .q1').text(
        d.quarter.Q1 ? d.quarter.Q1.toLocaleString() : ''
      );
      d3.select('#infoModal_qoqPopulation .q2').text(
        d.quarter.Q2 ? d.quarter.Q2.toLocaleString() : ''
      );
      d3.select('#infoModal_qoqPopulation .q3').text(
        d.quarter.Q3 ? d.quarter.Q3.toLocaleString() : ''
      );
      d3.select('#infoModal_qoqPopulation .q4').text(
        d.quarter.Q4 ? d.quarter.Q4.toLocaleString() : ''
      );
      d3.select('#infoModal_qoqPopulation .population').text(
        d.total.toLocaleString()
      );
      d3.select('#infoModal_qoqPopulation .percentage').text(
        (d.total / populationTotal).toFixed(2) + '%'
      );
      d3.select('#infoModal_qoqPopulation .percentage').text(
        ((d.total / populationTotal) * 100).toFixed(3) + '%'
      );

      d3.select(this)
        .select('rect')
        .interrupt();

      d3.select(this)
        .select('text')
        .interrupt();

      d3.select(this)
        .selectAll('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(5)
        .style('stroke', 'white')
        .style('stroke-width', '5');
      d3.select(this)
        .select('text')
        .style('font-size', '16px');
    }

    function onMouseOut(d, i) {
      d3.select('#infoModal_qoqPopulation').style('visibility', 'hidden');

      d3.select(this)
        .selectAll('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .style('stroke-width', '0');

      d3.select(this)
        .select('text')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '12px');
    }
  }
}
