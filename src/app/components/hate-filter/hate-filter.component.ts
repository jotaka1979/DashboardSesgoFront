import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'das-hate-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './hate-filter.component.html',
  styleUrl: './hate-filter.component.css',
  standalone: true,
})
export class HateFilterComponent {
  hate = signal<boolean | null>(null);

  filterChange = output<boolean | null>();

  setFilter(value: boolean | null) {
    this.hate.set(value);
    this.filterChange.emit(value);
  }
}
