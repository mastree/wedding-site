import { Component } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { CardComponent } from '../card/card.component';

/*
TODO:
- add moving clock countdown
- finish layout
*/

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <header class="h-[66vh] bg-white">
      <app-navigation-bar></app-navigation-bar>
      <div>
        <div class="flex w-full flex-col items-center justify-center p-7 text-primary">
          <p class="justify-center font-manuale text-[1.6875rem] font-bold">YOU'RE</p>
          <p class="justify-center font-manuale text-[1.6875rem] font-bold">INVITED</p>
        </div>
        <div class="flex w-full flex-col items-center justify-center">
          <div
            class="animate animate-scale-in animate-fast flex h-[6.5rem] w-[18rem] items-center justify-center rounded-md bg-primary"
          >
            <p class="font-manuale text-[2rem] font-semibold text-white">TO THE BIG DAY!</p>
          </div>
        </div>
        <div class="h-[1.75rem]"></div>
        <div class="flex w-full flex-col items-center justify-center">
          <app-countdown></app-countdown>
        </div>
      </div>
    </header>

    <section class="relative h-[34vh] bg-secondary">
      <div class="absolute top-0 flex w-full translate-y-[-100%] flex-col items-center justify-end">
        <p class="font-manuale text-[2rem] font-semibold text-primary">LEFT</p>
      </div>
      <div class="absolute top-0 flex w-full flex-col items-center justify-end">
        <p class="font-manuale text-[2rem] font-semibold text-primary">UNTIL</p>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
        <div>
          <p class="justify-center font-marcellus-sc text-[2rem] text-white">Kamal & Faiza's</p>
          <p class="justify-center font-marcellus-sc text-[2rem] text-white">Wedding</p>
        </div>
        <a href="">
          <div class="active-go-up flex gap-2 font-lato font-light text-white">
            <img src="download.svg" />
            <p class="line-2 text-[0.75rem] active:text-slate-100">Download invitation as PDF</p>
          </div>
        </a>
      </div>
      <div class="absolute bottom-0 mb-1 flex w-full items-center justify-center gap-0">
        <div class="size-8 rounded-[50%]">
          <svg class="animate-bounce-small" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="0.048"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                class="stroke-dark-item"
                d="M12 6L12 18M12 18L17 13M12 18L7 13"
                stroke="#FFFFFF"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
        <p class="text-center font-lato text-sm font-light text-dark-item">or scroll for details</p>
      </div>
    </section>

    <section class="flex flex-col gap-8 bg-white pb-20 pt-16">
      <div class="flex flex-col justify-center">
        <p class="text-center font-manuale text-xl font-semibold">SCHEDULE & LOCATION</p>
        <p class="text-md text-center font-manuale font-light">Jadwal & Tempat</p>
      </div>
      <div class="flex flex-grow flex-col items-center justify-start gap-8">
        <app-card icon="calendar.svg" title="Schedule">
          <p class="font-manuale text-[1rem]"><span class="font-semibold">Date:</span> Saturday, 16 Nov 2024</p>
          <p class="font-manuale text-[1rem]"><span class="font-semibold">Time:</span> 15.00 &mdash; 19.00 WIB</p>
        </app-card>
        <app-card icon="location-pin.svg" title="Location">
          <p class="font-manuale text-[1rem] font-semibold">Maxi's Resto</p>
          <p class="font-manuale text-[1rem]">Jl. Gunung Agung No.8, Ciumbuleuit, Kota Bandung</p>
          <a class="text-sky-400" href="https://maps.app.goo.gl/9kLNCJA7acvwyxJB8">
            <p class="mt-2">Open in GMaps</p>
          </a>
        </app-card>
      </div>
    </section>

    <section class="h-[100vh] bg-secondary">
      <p class="font-manuale text-3xl">RSVP!</p>
      <p class="font-marcellus-sc text-3xl">Number of people!</p>
      <p class="font-major-mono-display text-3xl">Leave a message!</p>
      <p class="font-manuale text-3xl"></p>
    </section>

    <footer class="w-full bg-dark-secondary p-3">
      <p class="text-center font-manuale text-sm text-white">
        <span class="font-semibold">Copyright</span> ©{{ current_year }}
        <a href="https://kamalshafi.me"><span class="text-semibold underline">kamalshafi</span></a
        >, All Rights Reserved
      </p>
    </footer>
  `,
  styleUrl: './home.component.css',
  imports: [NavigationBarComponent, CountdownComponent, CardComponent],
})
export class HomeComponent {
  get current_year(): number {
    return new Date().getFullYear();
  }
}
