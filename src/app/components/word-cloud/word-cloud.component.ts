import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  NgZone,
  OnDestroy
} from '@angular/core';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { Distribution } from '../../models/distribution';

@Component({
  selector: 'das-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrl: './word-cloud.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordCloudComponent
  implements AfterViewInit, OnChanges, OnDestroy {

  @Input() data: Distribution[] = [];
  @Input() chartTitle = '';
  @Input() height = 250;
  @Input() isLoading = false;

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  width = 0;

  private element!: HTMLElement;
  private layout: any;
  private destroyed = false;

  constructor(
    private el: ElementRef,
    private zone: NgZone
  ) {
    effect(() => {
      if (this.isLoading && this.element) {
        d3.select(this.element).select('svg').remove();
      }
    });
  }

  // =====================
  // INIT
  // =====================
  ngAfterViewInit() {
    this.element = this.container.nativeElement;

    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const width =
          this.container.nativeElement.clientWidth;
console.log("wa",width)
        if (!width) return; // ⛔ tab oculto

        this.width = width;
        console.log("wb",this.width )

        this.createWordCloud();
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.layout?.stop?.();
  }

  // =====================
  // INPUT CHANGES
  // =====================
  ngOnChanges(changes: SimpleChanges): void {
        console.log("w",this.width)
    if (changes['data'] && this.width) {
      this.clear();
      this.createWordCloud();
    }
  }

  // =====================
  // CLEAN
  // =====================
  clear() {
    this.layout?.stop?.();
    d3.select(this.container.nativeElement)
      .select('svg')
      .remove();
  }

  // =====================
  // CLOUD
  // =====================
  createWordCloud() {

    if (!this.width || !this.data?.length || this.isLoading) {
      return;
    }

    const width = this.width;
    const height = this.height;
    const element = this.container.nativeElement;

    const max = d3.max(this.data, d => d.count)!;
    const min = d3.min(this.data, d => d.count)!;

    const scale = d3.scaleLinear()
      .domain([min, max])
      .range([10, 50]);

    this.layout = cloud()
      .size([width, height])
      .words(
        this.data.map(d => ({
          text: d.label,
          real: d.count,
          size: scale(d.count)
        }))
      )
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .fontSize((d: any) => d.size)
      .on('end', (words: any[]) => {
        if (!this.destroyed) {
          this.drawCloud(words, element, width, height);
        }
      });

    this.layout.start();
  }

  // =====================
  // DRAW
  // =====================
  drawCloud(
    data: any[],
    element: HTMLElement,
    width: number,
    height: number
  ) {
    const tooltip =
      d3.select(element).select('.tooltip');

    d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr(
        'transform',
        `translate(${width / 2},${height / 2})`
      )
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .style('font-size', d => `${d.size}px`)
      .style(
        'fill',
        () =>
          d3.schemeCategory10[
            Math.floor(Math.random() * 10)
          ]
      )
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        d => `translate(${d.x},${d.y})rotate(${d.rotate})`
      )
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