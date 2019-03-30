import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  selector: 'app-canadamap',
  templateUrl: './canadamap.component.html',
  styleUrls: ['./canadamap.component.scss']
})
export class CanadamapComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 800;
  svgWidth = 590;
  provincesGroup;
  mapColours = ['blue', 'white', 'red'];

  constructor() {}

  ngOnInit() {
    this.svg = d3
      .select('#canadaMap')
      .append('svg')
      .attr('height', this.svgHeight)
      .attr('width', this.svgWidth);

    this.renderLogo();
    this.renderMap();
    this.renderMapLegend();
    this.renderOtherLabels();
    this.renderProvinceLabels();
  }

  renderLogo() {
    const logoG = this.svg.append('g').classed('logo', true);

    logoG
      .append('image')
      .attr('x', '15')
      .attr('y', '20')
      .attr('xlink:href', '../../assets/images/logo.png')
      .attr('width', '100px')
      .attr('height', '100px');

    logoG
      .append('text')
      .attr('x', '15')
      .attr('y', '140')
      .text('MAPLE PR');

    logoG
      .append('text')
      .attr('x', '48')
      .attr('y', '158')
      .text('VIS');
  }

  renderProvinceLabels() {
    const PRLabelsG = this.svg.append('g').classed(`province_labels`, true);

    for (let i = 1; i <= 13; i++) {
      const PRLabel = PRLabelsG.append('g').classed(
        `province_label_${i}`,
        true
      );

      PRLabel.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', '10');

      PRLabel.append('text')
        .attr('x', 0)
        .attr('y', 5)
        .attr('text-anchor', 'middle')
        .text(i)
        .classed('label_num', true);

      PRLabel.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .attr('text-anchor', 'start')
        .text('')
        .classed(`label_item label_item_${i}`, true);

      PRLabel.attr(
        'transform',
        `translate(${500 + Math.sin((Math.PI / 12) * i) * -70}, ${100 +
          (Math.PI / 12) * i * 80 +
          5 * i})`
      );
    }
  }

  updateProvinceLabel(rank, label) {
    d3.select(`.label_item_${rank}`).text(label);
  }

  renderOtherLabels() {
    this.svg
      .append('text')
      .attr('x', '30')
      .attr('y', '705')
      .text('INTENDED DESTINATION MAP')
      .classed('h1', true);
  }

  renderMapLegend() {
    const legendGroup = this.svg.append('g').classed('legend_group', true);

    const gradient = legendGroup
      .append('defs')
      .append('linearGradient')
      .attr('id', 'mygrad')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .style('stop-color', this.mapColours[0])
      .style('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '50%')
      .style('stop-color', this.mapColours[1])
      .style('stop-opacity', 1);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .style('stop-color', this.mapColours[2])
      .style('stop-opacity', 1);

    legendGroup
      .append('rect')
      .attr('width', '400')
      .attr('height', '20')
      .attr('fill', 'url(#mygrad)')
      .classed('legendRect', true);

    legendGroup
      .append('text')
      .attr('x', -30)
      .attr('y', 15)
      .attr('text-anchor', 'start')
      .text('Min')
      .classed('h4', true);

    legendGroup
      .append('text')
      .attr('x', 405)
      .attr('y', 15)
      .attr('text-anchor', 'start')
      .text('Max');

    legendGroup.attr('transform', 'translate(50, 750)');
  }

  renderMap() {
    console.log('renderMap()');
    // Load JSON Data then call render methods
    d3.json('../../assets/canada.topojson')
      .then(data => {
        this.ready(data);
      })
      .catch(err => {
        throw err;
      });
    console.log('renderMap() end');
  }

  ready(data) {
    const self = this;

    const height = self.svgHeight;
    const width = self.svgWidth;
    const margin = { top: 40, bottom: 30, left: 50, right: 30 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const colorScale = d3
      .scaleLinear()
      .domain([0, 6, 12])
      .range(this.mapColours);

    const g = self.svg.append('g').classed('maingroup', true);

    console.log('topojson data:');
    console.log(data);

    const projection = d3
      .geoMercator()
      .translate([880, 1000])
      .scale(350);

    const path = d3.geoPath().projection(projection);

    let provinces: any = topojson.feature(data, data.objects.gpr_000b11a_e);
    provinces = provinces.features;

    console.log(provinces);

    this.provincesGroup = g
      .selectAll('.province')
      .data(provinces)
      .enter()
      .append('path')
      .attr('class', (d: any) => `province ${d.properties.PREABBR}`)
      .attr('d', path)
      .attr('fill', (d: any, i) => colorScale(d.properties.PRUID))
      .style('transform-origin', '50% 50%')
      .each(d =>
        this.updateProvinceLabel(d.properties.PRUID, d.properties.PREABBR)
      )
      .on('mouseover', function(d, i) {
        self.onMouseOver(this, d, i);
      })
      .on('mouseout', function(d, i) {
        self.onMouseOut(this);
      })
      .on('click', function(d, i) {
        self.onClick(this, d);
      });
  }

  onMouseOver(sel: any, d, i) {
    // tooltip.style('visibility', 'visible').text(d.value + ' ' + unit);
    console.log(d.properties);
    console.log(d.properties.PREABBR);
    console.log(d.properties.PRENAME);
    console.log(i);

    d3.select(sel).style('opacity', 0.7);
  }

  onClick(sel: any, d) {
    d3.select(sel)
      .transition()
      .ease(d3.easeCubicIn)
      .duration(100)
      .style('transform', 'scale(1.1,1.1)')
      .transition()
      .ease(d3.easeCubicOut)
      .delay(100)
      .duration(50)
      .style('transform', 'scale(1,1)');

    d3.select(sel).classed(
      'clicked',
      d3.select(sel).classed('clicked') ? false : true
    );

    d3.select(`.province_label_${d.properties.PRUID}`).classed(
      'clicked',
      d3.select(`.province_label_${d.properties.PRUID}`).classed('clicked')
        ? false
        : true
    );
  }

  onMouseOut(sel: any) {
    d3.select(sel).style('opacity', 0.9);
  }
}
