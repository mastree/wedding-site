import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [],
  template: `
    <nav class="sticky top-0 z-10 flex w-full bg-slate-50 bg-opacity-75 p-3 drop-shadow-md">
      <p class="font-major-mono-display text-3xl text-primary drop-shadow-md">KF</p>
    </nav>
  `,
  styleUrl: './navigation-bar.component.css',
})
export class NavigationBarComponent {}
