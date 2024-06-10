import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [],
  template: `
    <nav class="flex top-0 w-full sticky p-3 drop-shadow-md bg-slate-50 z-10 bg-opacity-75">
      <p class="font-major-mono-display text-3xl text-primary">KF</p>
    </nav>
  `,
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent {

}
