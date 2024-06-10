import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <main class="h-screen">
      <header>
        <p class="text-3xl font-manuale">
          Hello world!
        </p>
        <p class="text-3xl font-marcellus-sc">
          Hello world!
        </p>
        <p class="text-3xl font-major-mono-display">
          Hello world!
        </p>
      </header>
      <section>
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  titleService: Title = inject(Title);

  constructor() {
    this.titleService.setTitle("Faiza & Kamal Wedding💍Invitation");
  }
}
