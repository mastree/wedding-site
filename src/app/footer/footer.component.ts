import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="bottom-0 w-full bg-dark-secondary p-3">
      <p class="text-center font-manuale text-[0.7rem] text-white">
        <span class="font-semibold">Copyright</span> ©{{ currentYear }}
        <a
          class="font-semibold hover:underline active:font-bold active:text-sky-700"
          href="https://kamalshafi.me"
          target="_blank"
          ><span>kamalshafi</span></a
        >, All Rights Reserved
      </p>
    </footer>
  `,
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
