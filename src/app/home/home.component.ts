import { Component } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { CountdownComponent } from '../countdown/countdown.component';

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
        <div
          class="w-full flex flex-col justify-center items-center p-7 text-primary"
        >
          <p class="font-manuale text-[1.6875rem] font-bold justify-center">
            YOU'RE
          </p>
          <p class="font-manuale text-[1.6875rem] font-bold justify-center">
            INVITED
          </p>
        </div>
        <div class="w-full flex flex-col justify-center items-center">
          <div
            class="
            flex justify-center items-center w-[18rem] h-[6.5rem] bg-primary rounded-md
            animate animate-scale-in animate-fast"
          >
            <p class="font-manuale text-[2rem] font-semibold text-white">
              TO THE BIG DAY!
            </p>
          </div>
        </div>
        <div class="h-[1.75rem]"></div>
        <div class="w-full flex flex-col justify-center items-center">
          <app-countdown></app-countdown>
        </div>
      </div>
    </header>

    <section class="h-[34vh] bg-secondary relative">
      <div
        class="w-full flex flex-col justify-end items-center absolute top-0 translate-y-[-100%]"
      >
        <p class="font-manuale text-[2rem] font-semibold text-primary">LEFT</p>
      </div>
      <div class="w-full flex flex-col justify-end items-center absolute top-0">
        <p class="font-manuale text-[2rem] font-semibold text-primary">UNTIL</p>
      </div>
      <div
        class="w-full h-full flex flex-col gap-5 justify-center items-center text-center"
      >
        <div>
          <p class="justify-center font-marcellus-sc text-white text-[2rem]">
            Kamal & Faiza's
          </p>
          <p class="justify-center font-marcellus-sc text-white text-[2rem]">
            Wedding
          </p>
        </div>
        <a href="">
          <div class="flex gap-2 font-lato font-light text-white active-go-up">
            <img src="download.svg" />
            <p class="line-2 text-[0.75rem] active:text-slate-100">
              Download invitation as PDF
            </p>
          </div>
        </a>
      </div>
      <div
        class="flex gap-0 justify-center items-center absolute bottom-0 mb-3 w-full"
      >
        <div class="size-8 rounded-[50%]">
          <svg
            class="animate-bounce-small"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
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
        <p class="font-lato text-sm text-dark-item font-light text-center">
          or scroll for details
        </p>
      </div>
    </section>

    <section>
      <p class="text-3xl font-manuale">Hello world!</p>
      <p class="text-3xl font-marcellus-sc">Hello world!</p>
      <p class="text-3xl font-major-mono-display">Hello world!</p>
      <p class="text-3xl font-manuale">
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world!Hello world! Hello world! Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world!Hello world! Hello
        world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world! Hello world!
        Hello world!Hello world!Hello world!Hello world!Hello world!Hello
        world!Hello world! Hello world! Hello world!Hello world!Hello
        world!Hello world!Hello world!Hello world!Hello world!
      </p>
    </section>
  `,
  styleUrl: './home.component.css',
  imports: [NavigationBarComponent, CountdownComponent],
})
export class HomeComponent {}
