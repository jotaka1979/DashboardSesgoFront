import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectionStrategy, effect, ViewChild, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import { Distribution } from '../../models/distribution';

@Component({
  selector: 'das-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent implements AfterViewInit, OnChanges {

  @Input() data: Distribution[] = [];
  @Input() height = 0;
  @Input() chartTitle = '';
  @Input() isLoading = false;
  @Input() extraLabelSpace = false;
  @Input() zoom = false;
  @Input() ticks = 5;
  @Input() color = '';
  @Output() barClick = new EventEmitter<Distribution>();

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  width = 0;
  private resizeObserver!: ResizeObserver;
  private element: any;
  private svg: any;

  private margin = { top: 10, right: 20, bottom: 40, left: 100 };

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
    this.element = this.el.nativeElement.querySelector('.bar-chart');
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
    if (changes['data'] && this.element) {
      this.createChart();
    }
  }

  private createChart(): void {
    const container = d3.select(this.element);
    container.select('svg').remove();
    container.select('.no-data').remove();
    if (this.isLoading)
      return;

    if (!this.width || !this.data?.length) {
      container.append('div')
        .attr('class', 'no-data')
        .style('text-align', 'center')
        .style('padding', '20px')
        .style('color', '#666')
        .style('font-size', '14px')
        .text('No hay datos para mostrar');
      return;
    }

    this.margin.left = this.extraLabelSpace ? 180 : 100;
    const { width, height, margin } = this;
    this.svg = d3.select(this.element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .on('click', (event: any) => {
        this.barClick.emit({
          code: "OTHER",
          label: "",
          count: 0,
          percentage: 0,
          color: ""
        })
      })

    this.updateChart();
  }

  private updateChart(): void {
    if (!this.data?.length) return;

    const { width, height, margin } = this;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.count)!])
      .range([0, chartWidth * 0.95]);

    const y = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, chartHeight])
      .padding(0.2);

    // Ejes
    this.svg.selectAll('.x-axis').remove();
    this.svg.selectAll('.y-axis').remove();

    if (this.width > 300) {
      this.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${chartHeight})`)
        .call(
          d3.axisBottom(x)
            .ticks(this.ticks)
            .tickFormat((d: d3.NumberValue) => {
              const value = Number(d);

              return value < 1
                ? d3.format(".2f")(value)
                : d3.format("~s")(value);
            })
        )
        .selectAll('text')
        .attr('font-size', '1.2em');
    }

    const yAxis = this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).tickSize(0))

    const yLabels = yAxis.selectAll('text')
      .attr('x', -5)
      .attr('font-size', '1.2em')
      .style('cursor', 'pointer')
      .style('font-weight', (d: any) => {
        const item = this.data.find(x => x.label === d);
        return item?.selected ? 'bold' : '400';
      })
      .on('click', (event: any, label: string) => {
        event.stopPropagation();
        const item = this.data.find(x => x.label === label);
        if (item) this.barClick.emit(item);
      });

    if (this.zoom) {
      yLabels
        .on('mouseover.zoom', function (this: SVGTextElement) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('transform', 'scale(2.5)');
        })
        .on('mouseout.zoom', function (this: SVGTextElement) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr('transform', 'scale(1)');
        });
    }

    // Barras
    this.svg.selectAll('.bar')
      .data(this.data)
      .join('rect')
      .attr('class', 'bar')
      .attr('y', (d: { label: string; }) => y(d.label)!)
      .attr('height', y.bandwidth())
      .attr('fill', (d: Distribution, i: number) => {
        if (this.color) return this.color;      // 🔹 color global
        if (d.color) return d.color;            // 🔹 color por item
        return d3.schemeTableau10[i % 10];      // 🔹 fallback
      })
      .attr('x', 1)
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        this.barClick.emit(d);
      })
      .transition()
      .duration(600)
      .attr('width', (d: { count: d3.NumberValue; }) => x(d.count));

    const labels = this.svg.selectAll('.label')
      .data(this.data)
      .join('text')
      .attr('class', 'label')
      .attr('font-size', '0.8em')
      .text((d: { count: any; percentage: any }) => `${d.count} (${d.percentage}%)`)
      .on('click', (event: any, d: any) => {
        event.stopPropagation();
        this.barClick.emit(d);
      })
      .attr('y', (d: { label: string; }) => y(d.label)! + y.bandwidth() / 2 + 4)
      .attr('font-weight', (d: any) => d.selected ? 'bold' : 'normal');

    labels.each((d: any, i: any, nodes: any) => {
      const textEl = d3.select(nodes[i]);
      const barWidth = x(d.count);

      // medir de una vez
      const textWidth = nodes[i].getComputedTextLength();

      if (barWidth > textWidth + 10) {
        // texto dentro
        textEl
          .attr('x', barWidth - 10)
          .attr('text-anchor', 'end')
          .attr('fill', 'white');

      } else {
        // texto fuera
        textEl
          .attr('x', barWidth + 10)
          .attr('text-anchor', 'start')
          .attr('fill', '#333');
      }
    });

  }
}
