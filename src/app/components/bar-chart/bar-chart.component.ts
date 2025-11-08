import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'das-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements AfterViewInit, OnChanges {

  @Input() data: { label: string; value: number; color?: string }[] = [];
  @Input() width = 600;
  @Input() height = 300;
  @Input() title = '';

  private svg: any;
  private element: any;
  private margin = { top: 30, right: 20, bottom: 30, left: 100 };

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.element = this.el.nativeElement.querySelector('.bar-chart');
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.svg && changes['data']) {
      this.updateChart();
    }
  }

  private createChart(): void {
    if (!this.data?.length) return;

    d3.select(this.element).select('svg').remove();

    const { width, height, margin } = this;
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.data?.length) return;

    const { width, height, margin } = this;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value)!])
      .range([0, chartWidth]);

    const y = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, chartHeight])
      .padding(0.2);

    const color = d3.scaleOrdinal<string>()
      .domain(this.data.map(d => d.label))
      .range(this.data.map((d, i) => d.color || d3.schemeTableau10[i % 10]));

    // Ejes
    this.svg.selectAll('.x-axis').remove();
    this.svg.selectAll('.y-axis').remove();

    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .attr('font-size', '0.8em');

    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).tickSize(0))
      .selectAll('text')
      .attr('font-size', '0.9em');

    // Barras
    const bars = this.svg.selectAll('.bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d: { label: string; }) => y(d.label)!)
      .attr('height', y.bandwidth())
      .attr('fill', (d: { label: string; }) => color(d.label)!)
      .attr('x', 0)
      .transition()
      .duration(600)
      .attr('width', (d: { value: d3.NumberValue; }) => x(d.value));

    // Etiquetas de valor
    this.svg.selectAll('.label')
      .data(this.data)
      .join('text')
      .attr('class', 'label')
      .attr('y', (d: { label: string; }) => (y(d.label)! + y.bandwidth() / 2) + 4)
      .attr('x', (d: { value: d3.NumberValue; }) => x(d.value) + 5)
      .attr('font-size', '0.85em')
      .attr('fill', '#333')
      .text((d: { value: any; }) => d.value);
  }
}
