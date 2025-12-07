import { Component, effect, Input, OnChanges, output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'das-hate-type-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './hate-type-filter.component.html',
  styleUrl: './hate-type-filter.component.css',
  standalone: true,
})
export class HateTypeFilterComponent implements OnChanges {
  @Input() isDisabled: boolean = false;
  hateType = signal<string | null>(null);
  filterChange = output<string | null>();

  hateTypes = [
    { label: 'Todos', value: null },
    { label: 'Político', value: '1' },
    { label: 'General', value: '2' },
    { label: 'Religioso', value: '3' },
    { label: 'Xenófobo', value: '4' },
    { label: 'Misógino', value: '5' },
    { label: 'Sexual', value: '6' },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isDisabled'] && this.isDisabled) {
      this.hateType.set(null)
    }
  }

  setFilter(value: string | null) {
    this.hateType.set(value);
    this.filterChange.emit(value);
  }
}
