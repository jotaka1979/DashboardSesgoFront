import { Component, Input, ElementRef, OnChanges, SimpleChanges, AfterViewInit, ChangeDetectionStrategy, effect, ViewChild, signal } from '@angular/core';
import * as d3 from 'd3';
import { Boxplot } from '../../models/boxplot';

@Component({
  selector: 'das-boxplot-chart',
  standalone: true,
  templateUrl: './boxplot-chart.component.html',
  styleUrls: ['./boxplot-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoxplotChartComponent implements AfterViewInit, OnChanges {

  @Input() data: Boxplot[] = [];
  @Input() height = 10;
  @Input() chartTitle = '';
  @Input() description = '';
  @Input() isLoading = false;
  @Input() ticks = 5;

  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  public tooltip: any;
  public bindTooltip = (
    tooltip: any,
    selection: any,
    label: string,
    valueFn: (d: any) => number
  ) => {
    selection
      .on("mouseenter", (event: MouseEvent, d: any) => {
        this.showTooltip(tooltip,
          event,
          `<strong>${d.category}</strong><br>${label}: ${valueFn(d)}`
        );
      })
      .on("mousemove", (event: MouseEvent) => {
        this.moveTooltip(tooltip, event);
      })
      .on("mouseleave", () => {
        this.hideTooltip(tooltip);
      });
  };

  width = 0;
  private resizeObserver!: ResizeObserver;
  private element: any;
  private svg: any;

  private margin = { top: 20, right: 20, bottom: 20, left: 60 };

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
    this.element = this.el.nativeElement.querySelector('.boxplot-chart');
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
    if (changes['data'] && this.element) {
      this.createChart();
    }
  }

  private createChart(): void {
    const container = d3.select(this.element);
    container.select('svg').remove();
    container.select('.no-data').remove();
    d3.select('body').selectAll('.boxplot-tooltip').remove();
    if (this.isLoading)
      return;

    if (!this.width) {
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

  public showTooltip(tooltip: any, event: MouseEvent, html: string) {
    console.log("show", html)
    console.log("tool", this.tooltip)
    tooltip
      .style("opacity", 1)
      .html(html)
      .style("left", event.pageX + 12 + "px")
      .style("top", event.pageY + 12 + "px");
  }

  public moveTooltip(tooltip: any, event: MouseEvent) {
    console.log("move")
    this.tooltip
      .style("left", event.pageX + 12 + "px")
      .style("top", event.pageX + 12 + "px");
  }

  public hideTooltip(tooltip: any) {
    console.log("hide")
    tooltip
      .style("opacity", 0);
  }

  private updateChart(): void {

    if (!this.data) return;

    const { width, height, margin } = this;
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'boxplot-tooltip')
      .style('position', 'absolute')
      .style('z-index', '999')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '6px 8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    const g = this.svg;

    const y = d3.scaleBand()
      .domain(this.data.map(d => d.category))
      .range([0, chartHeight])
      .padding(0.4);

    const minX = d3.min(this.data, d => d.min)!;
    const maxX = d3.max(this.data, d => d.max)!;
    const padding = (maxX - minX) * 0.05;

    const x = d3.scaleLinear()
      .domain([minX - padding, maxX + padding])
      .nice()
      .range([0, chartWidth]);

    g.append("g")
      .call(d3.axisLeft(y));

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    // =====================
    // Boxplots
    // =====================
    const boxes = g.selectAll(".box")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", (d: Boxplot) => `translate(0,${y(d.category)})`);

    boxes.each((d: any, i: any, nodes: any) => {
      const group = d3.select(nodes[i]);
      const center = y.bandwidth() / 2;

      // Bigote
      group.append("line")
        .attr("x1", x(d.min))
        .attr("x2", x(d.max))
        .attr("y1", center)
        .attr("y2", center)
        .attr("stroke", "black");

      // Caja Q1-Q3
      group.append("rect")
        .attr("x", x(d.q1))
        .attr("y", 0)
        .attr("width", x(d.q3) - x(d.q1))
        .attr("height", y.bandwidth())
        .attr("fill", "#c7d2fe")
        .attr("stroke", "black");

      // Mediana
      const median = group.append("line")
        .attr("x1", x(d.median))
        .attr("x2", x(d.median))
        .attr("y1", 0)
        .attr("y2", y.bandwidth())
        .attr("stroke", "black");

      this.bindTooltip(tooltip, median, "Mediana", d => d.median);

      const mean = group.append("circle")
        .attr("cx", x(d.mean))
        .attr("cy", center)
        .attr("r", 3)
        .attr("fill", "red");
      this.bindTooltip(tooltip, mean, "Media", d => d.mean);

      // Min
      const minLine = group.append("line")
        .datum(d)
        .attr("x1", x(d.min))
        .attr("x2", x(d.min))
        .attr("y1", y.bandwidth() * 0.25)
        .attr("y2", y.bandwidth() * 0.75)
        .attr("stroke", "black");

      const minHitbox = group.append("rect")
        .datum(d)
        .attr("x", x(d.min) - 6)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", y.bandwidth())
        .attr("fill", "transparent")
        .style("pointer-events", "all");

      this.bindTooltip(tooltip, minHitbox, "Min", d => d.min);

      // Max
      const maxLine = group.append("line")
        .attr("x1", x(d.max))
        .attr("x2", x(d.max))
        .attr("y1", y.bandwidth() * 0.25)
        .attr("y2", y.bandwidth() * 0.75)
        .attr("stroke", "black");

      this.bindTooltip(tooltip, maxLine, "Max", d => d.max);
    });
  }
}