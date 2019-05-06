import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 400;
  svgWidth = '100%';
  graphHeight = 300;
  graphWidth = 800;
  provincesGroup;
  mapColours = ['blue', 'white', 'red'];

  margin = { top: 40, bottom: 30, left: 20, right: 30 };
  innerWidth = this.graphWidth - this.margin.left - this.margin.right;
  innerHeight = this.graphHeight - this.margin.top - this.margin.bottom;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.svg = d3
      .select('#barChart')
      .append('svg')
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth);

    this.initBarChart([], this.svg, 0, 0);
    this.renderOtherLabels();
  }

  renderOtherLabels() {
    this.svg
      .append('text')
      .attr('x', this.graphWidth - 550)
      .attr('y', '100')
      .text('Top 20 PR Immigrant Countries (Canada-wide)')
      .classed('h1 chart-title', true);
  }

  initBarChart(data, svg, yscale_upperbound, yaxis_ticks) {
    const yScale = d3
      .scaleLinear()
      .domain([0, yscale_upperbound])
      .range([this.innerHeight, 0]);

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.country))
      .range([0, this.innerWidth])
      .padding(0.1);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(yaxis_ticks)
      .tickSize(innerWidth)
      .tickPadding(10);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10);

    const g = svg
      .append('g')
      .classed('main', true)
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    g.append('g')
      .classed('y-axis grid-tick domain_hidden', true)
      .call(yAxis)
      .attr('transform', `translate(${this.innerWidth},${0})`);

    g.append('g')
      .classed('x-axis', true)
      .call(xAxis)
      .attr('transform', `translate(0,${this.innerHeight})`)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-25)');

    this.subscribeToData();
  }

  async subscribeToData() {
    await this.data.dataReady;

    this.data.topCountriesData.subscribe(
      data => {
        this.updateBarChart(
          data[0],
          this.svg,
          data[1].populationMax,
          0,
          '',
          data[1].populationTotal
        );
      },
      error => console.error('There was an error retrieving the data', error),
      () => console.log('Data retrieved!')
    );

    this.data.updateCountriesBarchart.emit();
  }

  updateBarChart(
    data,
    svg,
    yscale_upperbound,
    yaxis_ticks,
    unit,
    populationTotal
  ) {
    let _this = this;

    const yScale = d3
      .scaleLinear()
      .domain([0, yscale_upperbound])
      .range([this.innerHeight, 0]);

    const xScale = d3
      .scaleBand()
      .domain(data.map(d => d.country))
      .range([0, this.innerWidth])
      .padding(0.1);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(yaxis_ticks)
      .tickSize(innerWidth)
      .tickPadding(10);

    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10);

    svg.select('g.y-axis').call(yAxis);

    svg
      .select('g.x-axis')
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-25)');

    const itemGroup = svg
      .select('g.main')
      .selectAll('.g_itemGroup')
      .data(data)
      .on('mouseover', onMouseOver)
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut);

    const newItemGroup = itemGroup
      .enter()
      .append('g')
      .classed('g_itemGroup', true)
      .on('mouseover', onMouseOver)
      .on('mousemove', onMouseMove)
      .on('mouseout', onMouseOut);

    itemGroup.exit().remove();

    newItemGroup.append('rect');
    newItemGroup.append('text');

    svg
      .selectAll('.g_itemGroup')
      .select('text')
      .classed('barLabels', true)
      .transition()
      .delay((d, i) => 500 + i * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .on('interrupt', function() {
        d3.select(this)
          .attr('y', d => yScale(d.population) - 2)
          .each(d => console.log(xScale(d.country) + xScale.bandwidth() / 2))
          .each(d => console.log((d.country)))
          .each(d => console.log(xScale(d.country)))
          .each(d => console.log(xScale.bandwidth()))
          .attr('x', d => xScale(d.country) + xScale.bandwidth() / 2)
          .attr('text-anchor', 'middle')
          .text(d => ((d.population / populationTotal) * 100).toFixed(1) + '%');
      })
      .attr('y', d => yScale(d.population) - 2)
      .attr('x', d => xScale(d.country) + xScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .text(d => ((d.population / populationTotal) * 100).toFixed(1) + '%');

    svg
      .selectAll('.g_itemGroup')
      .select('rect')
      .transition()
      .delay((d, i) => (20 - i) * 50)
      .ease(d3.easeLinear)
      .duration(500)
      .on('interrupt', function() {
        d3.select(this)
          .attr('x', (d, i) => xScale(d.country))
          .attr(
            'y',
            d => _this.innerHeight - (yScale(0) - yScale(d.population))
          )
          .attr('width', xScale.bandwidth)
          .attr('height', d => yScale(0) - yScale(d.population))
          .attr(
            'fill',
            (d, i) => `rgb(${10 * (data.length - i)}, 20, ${7 * i})`
          );
      })
      .attr('x', (d, i) => xScale(d.country))
      .attr('y', d => this.innerHeight - (yScale(0) - yScale(d.population)))
      .attr('width', xScale.bandwidth)
      .attr('height', d => yScale(0) - yScale(d.population))
      .attr('fill', (d, i) => `rgb(${10 * (data.length - i)}, 20, ${7 * i})`);

    function onMouseOver(d) {
      d3.select('#infoModal_TopCountries').style('visibility', 'visible');

      d3.select('#infoModal_TopCountries .country').text(d.country);
      d3.select('#infoModal_TopCountries .population').text(
        d.population.toLocaleString()
      );
      d3.select('#infoModal_TopCountries .percentage').text(
        ((d.population / populationTotal) * 100).toFixed(3) + '%'
      );

      d3.select(this)
        .select('rect')
        .interrupt();

      d3.select(this)
        .select('text')
        .interrupt();

      d3.select(this)
        .select('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(5)
        .style('fill', '#ffa600');
      d3.select(this)
        .select('text')
        .style('font-size', '16px');
    }

    function onMouseMove(d) {
      // d3.select('#infoModal_TopCountries')
      // .style('top', d3.mouse(this)[1] - 80 + 'px')
      // .style('left', d3.mouse(this)[0] + 10 + 'px');
    }

    function onMouseOut(d, i) {
      d3.select('#infoModal_TopCountries').style('visibility', 'hidden');

      d3.select(this)
        .select('rect')
        .transition()
        .ease(d3.easeLinear)
        .duration(1000)
        .style('fill', `rgb(${10 * (data.length - i)}, 20, ${7 * i})`);

      d3.select(this)
        .select('text')
        .transition()
        .ease(d3.easeLinear)
        .duration(250)
        .style('font-size', '12px');
    }
  }
}
