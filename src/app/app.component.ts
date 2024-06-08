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
        Hello world!
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
