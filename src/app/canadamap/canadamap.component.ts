import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import { DataService } from '../data.service';

@Component({
  selector: 'app-canadamap',
  templateUrl: './canadamap.component.html',
  styleUrls: ['./canadamap.component.scss']
})
export class CanadamapComponent implements OnInit {
  svg: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
  svgHeight = 820;
  svgWidth = 590;
  provincesGroup;
  mapColours = ['#001447', 'white', 'red'];
  colorScale = d3
    .scaleLinear()
    .domain([12, 6, 0])
    .range(this.mapColours);

  constructor(private data: DataService) {}

  async ngOnInit() {
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

      PRLabel.append('rect')
        .attr('x', -10)
        .attr('y', -10)
        .attr('rx', '10')
        .attr('ry', '10')
        .attr('width', '500')
        .attr('height', '20')
        .style('fill', 'white');

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
        `translate(${500 + Math.sin((Math.PI / 12) * i) * -70}, ${120 +
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
      .append('path')
      .attr('id', 'curve1')
      .attr('fill', 'transparent')
      .attr('d', 'M153,350 C161,220 299,185 425,40')
      .attr('transform', 'translate(-55, -20)');

    this.svg
      .append('path')
      .attr('id', 'curve2')
      .attr('fill', 'transparent')
      .attr('d', 'M153,350 C161,220 289,170 410,40')
      .attr('transform', 'translate(-75, -20)');

    this.svg
      .append('text')
      .append('textPath')
      .attr('xlink:href', '#curve1')
      .text('Immigrants Intended Destination Map')
      .classed('h1', true);

    this.svg
      .append('text')
      .append('textPath')
      .attr('xlink:href', '#curve2')
      .text('Total PR Immigrant Population: 354,343,232')
      .classed('h1 totalPopulation', true);

    this.svg
      .append('text')
      .attr('x', 510)
      .attr('y', 125)
      .attr('text-anchor', 'start')
      .style('fill', '#505050')
      .style('font-weight', 'bold')
      .text('Ranking');

    this.svg
      .append('text')
      .text('Data Source: Government of Canada')
      .style('fill', 'gray')
      .style('font-size', '12px')
      .attr('x', 20)
      .attr('y', 805);

    this.svg
      .append('text')
      .text(
        'https://open.canada.ca/data/en/dataset/f7e5498e-0ad8-4417-85c9-9b8aff9b9eda'
      )
      .style('fill', 'gray')
      .style('font-size', '10px')
      .attr('x', 20)
      .attr('y', 815);
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
      .attr('height', '10')
      .attr('rx', '5')
      .attr('ry', '5')
      .attr('stroke', 'black')
      .attr('stroke-width', '0.5')
      .attr('fill', 'url(#mygrad)')
      .classed('legendRect', true);

    legendGroup
      .append('text')
      .attr('x', 0)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .text('Min')
      .classed('legendMin', true);

    legendGroup
      .append('text')
      .attr('x', 200)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .text('Mid')
      .classed('legendMid', true);

    legendGroup
      .append('text')
      .attr('x', 400)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .text('Max')
      .classed('legendMax', true);

    legendGroup.attr('transform', 'translate(60, 750)');
  }

  renderMap() {
    // Load JSON Data then call render methods
    d3.json('../../assets/canada.topojson')
      .then(data => {
        this.ready(data);
      })
      .catch(err => {
        throw err;
      });
  }

  ready(data) {
    const g = this.svg.append('g').classed('maingroup', true);
    const _this = this;

    const projection = d3
      .geoMercator()
      .translate([870, 1020])
      .scale(350);

    const path = d3.geoPath().projection(projection);

    let provinces: any = topojson.feature(data, data.objects.gpr_000b11a_e);
    provinces = provinces.features;

    this.provincesGroup = g
      .selectAll('.province')
      .data(provinces)
      .enter()
      .append('path')
      .attr('class', (d: any) => `province province${d.properties.PRUID}`)
      .attr('d', path)
      .attr('fill', (d: any, i) => this.colorScale(d.properties.PRUID - 1))
      .style('transform-origin', '50% 50%')
      .each(d => {
        this.updateProvinceLabel(d.properties.PRUID, d.properties.PREABBR);
        d.properties.RANK = +d.properties.PRUID;
      })
      .on('mouseover', onMouseOver)
      .on('mouseout', onMouseOut)
      .on('mousemove', onMouseMove)
      .on('click', onClick);

    function onMouseOver(d, i) {
      d3.select('#canadaMap_toolTip').style('visibility', 'visible');
      d3.select('#canadaMap_toolTip .name').text(d.properties.PRENAME);
      d3.select('#canadaMap_toolTip .percentage').text(d.properties.PERCENTAGE);
      d3.select('#canadaMap_toolTip .population').text(d.properties.POPULATION);

      d3.select(this).style('opacity', 0.7);
    }

    function onClick(d) {
      d3.select(this)
        .transition()
        .ease(d3.easeCubicIn)
        .duration(100)
        .style('transform', 'scale(1.1,1.1)')
        .transition()
        .ease(d3.easeCubicOut)
        .delay(100)
        .duration(50)
        .style('transform', 'scale(1,1)');

      d3.select(this).classed('clicked', () => {
        if (d3.select(this).classed('clicked')) {
          _this.data.selectedProvinces[d.properties.PRUID - 1] = '';
          return false;
        } else {
          _this.data.selectedProvinces[d.properties.PRUID - 1] =
            d.properties.PRENAME;
          return true;
        }
      });

      d3.select(`.province_label_${d.properties.RANK}`).classed(
        'clicked',
        d3.select(`.province_label_${d.properties.RANK}`).classed('clicked')
          ? false
          : true
      );

      _this.data.provincesChanged.emit();
    }

    function onMouseMove(d) {
      d3.select('#canadaMap_toolTip')
        .style('top', d3.mouse(this)[1] + 10 + 'px')
        .style('left', d3.mouse(this)[0] + 10 + 'px');
    }

    function onMouseOut() {
      d3.select('#canadaMap_toolTip').style('visibility', 'hidden');
      d3.select(this).style('opacity', 0.9);
    }

    this.subscribeToData();
  }

  async subscribeToData() {
    const myObserver = {
      next: data => {
        this.updateMap(
          data[0],
          data[1].populationMin,
          data[1].populationMax,
          data[1].populationTotal
        );
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification')
    };

    await this.data.dataReady;
    this.data.totalPopulationData.subscribe(myObserver);
    this.data.updateCanadaMap.emit();
  }

  updateMap(data, minPopulation, maxPopulation, totalPopulation) {
    this.svg.select('.legendMin').text(minPopulation.toLocaleString());
    this.svg
      .select('.legendMid')
      .text(Math.round((minPopulation + maxPopulation) / 2).toLocaleString());
    this.svg.select('.legendMax').text(maxPopulation.toLocaleString());
    this.svg
      .select('.h1.totalPopulation')
      .text(
        'Total PR Immigrant Population: ' + totalPopulation.toLocaleString()
      );

    const ratedObjects = [...data];

    ratedObjects.sort((a, b) => {
      return b.population - a.population;
    });

    this.colorScale.domain([
      minPopulation,
      Math.round((minPopulation + maxPopulation) / 2),
      maxPopulation
    ]);

    this.provincesGroup
      .transition()
      .ease(d3.easeCubicIn)
      .duration(1000)
      .attr('fill', (d: any, i) =>
        this.colorScale(+data[d.properties.PRUID - 1].population)
      )
      .each((d, i) => {
        this.updateProvinceLabel(
          ratedObjects.indexOf(data[+d.properties.PRUID - 1]) + 1,
          d.properties.PREABBR
        );
        d.properties.RANK =
          ratedObjects.indexOf(data[+d.properties.PRUID - 1]) + 1;
        d.properties.PERCENTAGE =
          (
            (+data[d.properties.PRUID - 1].population / totalPopulation) *
            100
          ).toFixed(3) + '%';
        d.properties.POPULATION = (+data[d.properties.PRUID - 1]
          .population).toLocaleString();
      });
  }
}
