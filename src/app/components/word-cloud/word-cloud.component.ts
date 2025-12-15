import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { Distribution } from '../../models/distribution';

@Component({
  selector: 'das-word-cloud',
  imports: [],
  templateUrl: './word-cloud.component.html',
  styleUrl: './word-cloud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordCloudComponent implements AfterViewInit, OnChanges {
  @Input() data: Distribution[] = [];
  @Input() chartTitle = '';
  @Input() height = 250;
  @Input() isLoading = false;
  @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;
  width = 0;
  private element: any;

  constructor(private el: ElementRef) {
    effect(() => {
      const data = this.isLoading;
      if (this.isLoading)
        d3.select(this.element).select('svg').remove();
    });
  }

  ngAfterViewInit() {
    this.width = this.container.nativeElement.clientWidth;
    this.createWordCloud();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.clear();
      this.createWordCloud();
    }
  }

  clear() {
    const svg = this.container.nativeElement.querySelector('svg');
    if (svg) svg.remove();
  }

  createWordCloud() {

    const element = this.container.nativeElement;
    const width = this.width;
    const height = this.height;

    const max = d3.max(this.data, d => d.count)!;
    const min = d3.min(this.data, d => d.count)!;

    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([10, 50]);

    const layout = cloud()
      .size([width, height])
      .words(this.data.map(d => ({ text: d.label, real: d.count, size: scale(d.count) })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize((d: any) => d.size)
      .on('end', (data) => this.drawCloud(data, element, width, height));

    layout.start();
  }


  drawCloud(data: any, element: HTMLElement, width: number, height: number) {
    const tooltip = d3.select(element).select('.tooltip');
    d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')
      .selectAll('text')
      .data(data)
      .enter().append('text')
      .style('font-size', (d: any) => d.size + 'px')
      .style('fill', () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
      .attr('text-anchor', 'middle')
      .attr('transform', (d: any) => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
      .text((d: any) => d.text)
      .on('mouseover', function (event: MouseEvent, d: any) {
        tooltip
          .style('opacity', '1')
          .html(`
      <b>${d.text}</b><br>
      Frecuencia: ${d.real}
    `);
      })
      .on('mousemove', function (event: MouseEvent) {
        tooltip
          .style('left', event.offsetX + 10 + 'px')
          .style('top', event.offsetY + 10 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', '0');
      });
  }

}