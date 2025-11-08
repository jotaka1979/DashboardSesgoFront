import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'das-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements AfterViewInit, OnChanges {

  @Input() data: { label: string; value: number; registros?: number; color?: string }[] = [];
  @Input() width = 200;
  @Input() height = 200;
  @Input() innerRadius = 50;
  @Input() showLabels = true;
  @Input() title = '';

  private svg: any;
  private radius = 3;
  private element: any;
  private tooltip: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.element = this.el.nativeElement.querySelector('.pie-chart');
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.svg && changes['data']) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.data?.length) return;

    const { width, height } = this;
    this.radius = Math.min(width, height) / 2;

    d3.select(this.element).select('svg').remove(); // limpiar gráfico previo
    d3.select(this.element).select('.tooltip').remove(); // limpiar tooltip previo

    this.svg = d3
      .select(this.element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    this.tooltip = d3
      .select(this.element)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.75)')
      .style('color', '#fff')
      .style('padding', '6px 10px')
      .style('border-radius', '6px')
      .style('font-size', '0.85em')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    this.updateChart();
  }

  private updateChart(): void {
  const color = d3.scaleOrdinal<string>()
    .domain(this.data.map(d => d.label))
    .range(this.data.map(d => d.color || d3.schemeTableau10[this.data.indexOf(d) % 10]));

  const pie = d3.pie<any>()
    .value((d: any) => d.value)
    .sort(null);

  const arc = d3.arc<any>()
    .innerRadius(this.innerRadius)
    .outerRadius(this.radius - 10);

  const tooltip = d3.select(this.element)
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.75)')
    .style('color', '#fff')
    .style('padding', '6px 10px')
    .style('border-radius', '6px')
    .style('font-size', '0.85em')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  const total = d3.sum(this.data, (d: any) => d.value);

  const arcs = this.svg.selectAll('path')
    .data(pie(this.data))
    .join('path')
    .attr('d', arc)
    .attr('fill', (d: any) => color(d.data.label))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .on('mouseover', (event: MouseEvent, d: any) => {
      const percent = ((d.value / total) * 100).toFixed(1);
      tooltip
        .html(`
          <strong>${d.data.label}</strong><br>
          ${percent}%<br>
          ${d.data.records ?? 0} registros
        `)
        .style('opacity', 1);
    })
    .on('mousemove', (event: MouseEvent) => {
      tooltip
        .style('left', event.offsetX + 15 + 'px')
        .style('top', event.offsetY - 20 + 'px');
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    });

  if (this.showLabels) {
    const labelArc = d3.arc<any>()
      .innerRadius(this.radius * 0.7)
      .outerRadius(this.radius * 0.7);

    this.svg.selectAll('text')
      .data(pie(this.data))
      .join('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '1.2em')
      .attr('fill', '#000')
      .text((d: any) => `${d.data.label} (${d.data.value}%)`);
  }
}}
