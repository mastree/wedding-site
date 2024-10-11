import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [NgClass],
  template: `
    <nav [ngClass]="additinalClass" class="sticky top-0 z-10 flex w-full bg-opacity-75 p-3 drop-shadow-md">
      <p class="font-major-mono-display text-2xl text-primary drop-shadow-md">KF</p>
    </nav>
  `,
  styleUrl: './navigation-bar.component.css',
})
export class NavigationBarComponent {
  @Input() additinalClass: string = 'bg-slate-50';
}
