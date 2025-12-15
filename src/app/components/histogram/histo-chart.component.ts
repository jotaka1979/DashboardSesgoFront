import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectionStrategy, effect, ViewChild, Output, EventEmitter, signal } from '@angular/core';
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

  @Input() data: MessageLength = { median:0,mean: 0, std: 0, histogram: [] };
  @Input() height = 250;
  @Input() chartTitle = '';
  @Input() isLoading = false;
  @Input() extraLabelSpace = false;
  @Input() zoom = false;
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

  // Convertimos x a número
  const data = this.histogram().map(d => ({
    ...d,
    xValue: +d.x
  }));

  // ===== ESCALAS =====

  // X continua
  const x = d3.scaleLinear()
    .domain([
      d3.min(data, d => d.xValue)!,
      d3.max(data, d => d.xValue)!
    ])
    .nice()
    .range([0, chartWidth]);

    const xBand = d3.scaleBand()
  .domain(this.histogram().map(d => d.range))
  .range([0, chartWidth]);

  // Y
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.count)!])
    .nice()
    .range([chartHeight, 0]);

  // Ancho del bin (asumimos bins equidistantes)
  const binWidth =
    data.length > 1
      ? (x(data[1].xValue) - x(data[0].xValue)) * 0.9
      : chartWidth;

  // ===== EJES =====

  // Eje X
this.svg.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0,${chartHeight})`)
  .call(
    d3.axisBottom(xBand)
      .tickFormat(d => d)
  )
  .selectAll('text')
  .attr('font-size', '0.9em')
  .attr('text-anchor', 'middle');

  // Eje Y
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

  // ===== BARRAS =====

  this.svg.selectAll('.bar')
    .data(data)
    .join('rect')
    .attr('class', 'bar')
    .attr('x', (d:any) => x(d.xValue) - binWidth / 2)
    .attr('width', binWidth)
    .attr('y', (d:any) => y(d.count))
    .attr('height', (d:any) => chartHeight - y(d.count))
    .attr('fill', (d:any) => d.color || '#69b3a2');

  // ===== ETIQUETAS =====

  this.svg.selectAll('.label')
    .data(data)
    .join('text')
    .attr('class', 'label')
    .attr('font-size', '0.7em')
    .attr('text-anchor', 'middle')
    .text((d:any) => d.count)
    .attr('x', (d:any) => x(d.xValue))
    .attr('y',(d:any) => y(d.count) - 5)
    .attr('fill', '#333');

  // ===== LÍNEA DE LA MEDIA =====

  const meanX = x(this.data.mean);

  this.svg.append('line')
    .attr('x1', meanX)
    .attr('x2', meanX)
    .attr('y1', 0)
    .attr('y2', chartHeight)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '6,4');

  // Texto de la media
  this.svg.append('text')
    .attr('x', meanX + 6)
    .attr('y', 12)
    .attr('fill', 'red')
    .attr('font-size', '0.75em')
    .text(`μ = ${this.data.mean.toFixed(2)}`);

  // ===== DESVIACIÓN ESTÁNDAR =====

  const std = this.data.std;

  [this.data.mean - std, this.data.mean + std].forEach(v => {
    const xPos = x(v);
    if (isNaN(xPos)) return;

    this.svg.append('line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', 0)
      .attr('y2', chartHeight)
      .attr('stroke', '#f97316')
      .attr('stroke-dasharray', '2,2');
  });
}

}