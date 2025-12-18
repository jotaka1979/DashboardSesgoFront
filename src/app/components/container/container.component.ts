import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'das-container',
  imports: [NgIconComponent, RouterLink],
  templateUrl: `container.component.html`,
  styleUrl: './container.component.css',
  standalone: true,
})
export class ContainerComponent {
  @Input() loading = false;
  @Input() menuVisible = false;
  @Input() processVisible = false;
  @Output() onSearch = new EventEmitter();
  @Output() onProcess = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  public menuOpen = signal<boolean>(false);

  openMenu() {
    this.menuOpen.set(true);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  searchClick() {
    this.menuOpen.set(false);
    this.onSearch.emit();
  }

  processClick() {
    this.menuOpen.set(false);
    this.onProcess.emit();
  }

  deleteClick() {
    this.menuOpen.set(false);
    this.onDelete.emit();
  }
}
