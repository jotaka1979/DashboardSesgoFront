import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectionStrategy, effect, ViewChild, signal } from '@angular/core';
import * as d3 from 'd3';
import { Histogram } from '../../models/histogram';
import { MessageLength } from '../../models/MessageLength';

@Component({
  selector: 'das-histo-chart',
  standalone: true,
  templateUrl: './histo-chart.component.html',
  styleUrls: ['./histo-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoChartComponent implements AfterViewInit, OnChanges {

  @Input() data: MessageLength = { median: 0, mean: 0, std: 0, histogram: [] };
  @Input() height = 250;
  @Input() chartTitle = '';
  @Input() description = '';
  @Input() isLoading = false;  
  @Input() ticks = 5;

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  width = 0;
  private histogram = signal<Histogram[]>([]);
  private resizeObserver!: ResizeObserver;
  private element: any;
  private svg: any;

  private margin = { top: 20, right: 20, bottom: 20, left: 40 };

  constructor(private el: ElementRef) {
    effect(() => {
      const data = this.isLoading;
      if (this.isLoading) {
        d3.select(this.element).select('svg').remove();
        d3.select(this.element).select('.no-data').remove();
      }
    });
  }

  ngAfterViewInit(): void {
    this.element = this.el.nativeElement.querySelector('.histo-chart');
    console.log(this.element)
    this.resizeObserver = new ResizeObserver(() => {
      this.width = this.container.nativeElement.clientWidth;
      this.createChart();
    });

    this.resizeObserver.observe(this.container.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("on changes")
    if (changes['data'] && this.element) {

      this.histogram.set(this.data.histogram);
      console.log(this.histogram())
      this.createChart();
    }
  }

  private createChart(): void {
    const container = d3.select(this.element);
    container.select('svg').remove();
    container.select('.no-data').remove();
    container.selectAll('.histo-tooltip').remove();
    if (this.isLoading)
      return;

    if (!this.width || !this.histogram().length) {
      console.log('append')
      container.append('div')
        .attr('class', 'no-data')
        .style('text-align', 'center')
        .style('padding', '20px')
        .style('color', '#666')
        .style('font-size', '14px')
        .text('No hay datos para mostrar');
      return;
    }

    const { width, height, margin } = this;
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)


    this.updateChart();
  }

  private updateChart(): void {

    if (!this.histogram().length) return;

    const { width, height, margin } = this;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'histo-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '6px 8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const barWidthPercentage = 0.7;
    const offsetX = (1 - barWidthPercentage) / 2

    const data = this.histogram().map(d => {
      const [x0, x1] = d.range.split('-').map(Number);
      return {
        ...d,
        x0,
        x1,
        mid: (x0 + x1) / 2,
        x: x0 + (offsetX * (x1 - x0))
      };
    });

    const x = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.x0)!,
        d3.max(data, d => d.x1)!
      ])
      .range([0, chartWidth]);

    const xBand = d3.scaleBand()
      .domain(this.histogram().map(d => d.range))
      .range([0, chartWidth]);

    // Y
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)!])
      .nice()
      .range([chartHeight, 0]);

    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(
        d3.axisBottom(x)
          .tickValues(data.map(d => d.mid))   // 👈 posiciones
          .tickFormat((_, i) => data[i]?.range ?? '') // 👈 texto
      )
      .selectAll('text')
      .attr('font-size', '0.9em')
      .attr('text-anchor', 'middle');

    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(
        d3.axisLeft(y)
          .ticks(this.ticks)
          .tickFormat((d: d3.NumberValue) => {
            const v = Number(d);
            return v < 1
              ? d3.format('.2f')(v)
              : d3.format('~s')(v);
          })
      );

    this.svg.selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d: any) => x(d.x))
      .attr('width', (d: any) => barWidthPercentage * (x(d.x1) - x(d.x0)))
      .attr('y', (d: any) => y(d.count))
      .attr('height', (d: any) => chartHeight - y(d.count))
      .attr('fill', (d: any) => d.color || '#69b3a2')

      .on('mouseover', (event: any, d: any) => {
        tooltip
          .style('opacity', 1)
          .html(`
        <div><strong>Rango:</strong> ${d.range ?? `${d.x0}-${d.x1}`}</div>
      <div><strong>Conteo:</strong> ${d.count ?? 0}</div>
      `);
      })
      .on('mousemove', (event: any) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });

    this.svg.selectAll('.label')
      .data(data)
      .join('text')
      .attr('class', 'label')
      .attr('font-size', '0.8em')
      .attr('text-anchor', 'middle')
      .text((d: any) => d.count)
      .attr('x', (d: any) => x(d.x) + 20)
      .attr('y', (d: any) => y(d.count) - 5)
      .attr('fill', '#333');

    const meanX = x(this.data.mean);
    const medianX = x(this.data.median);

    this.svg.append('line')
      .attr('x1', meanX)
      .attr('x2', meanX)
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'red')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '6,4');
    
    this.svg.append('text')
      .attr('x', meanX + 6)
      .attr('y', 12)
      .attr('fill', 'red')
      .attr('font-size', '0.75em')
      .text(`μ = ${this.data.mean.toFixed(1)}`);

    this.svg.append('line')
      .attr('x1', medianX)
      .attr('x2', medianX)
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', 'blue')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '6,4');     
  }
}