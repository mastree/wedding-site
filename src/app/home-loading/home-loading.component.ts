import { Component } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home-loading',
  standalone: true,
  template: `
    <div class="relative top-0 flex h-screen w-full flex-col bg-white bg-opacity-30">
      <div class="absolute bottom-0 top-0 z-10 h-full w-full">
        <app-navigation-bar></app-navigation-bar>
      </div>
      <div class="flex size-8 w-full flex-grow items-center justify-center">
        <div class="flex flex-col items-center justify-center">
          <div class="mb-5 size-8 fill-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
          </div>
          <p class="text=md font-manuale text-primary">Fetching invitation...</p>
          <p class="text=md font-manuale text-primary">Please wait</p>
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './home-loading.component.css',
  imports: [NavigationBarComponent, FooterComponent],
})
export class HomeLoadingComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
}
