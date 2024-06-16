import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <main class="relative h-full w-screen overflow-hidden">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrl: './app.component.css',
  imports: [RouterOutlet, NavigationBarComponent],
})
export class AppComponent {
  titleService: Title = inject(Title);

  constructor() {
    this.titleService.setTitle('Faiza & Kamal Wedding💍Invitation');
  }
}
