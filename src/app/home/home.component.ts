import { Component } from '@angular/core';
import { NavigationBarComponent } from "../navigation-bar/navigation-bar.component";
import { CountdownComponent } from "../countdown/countdown.component";

/*
TODO:
- add moving clock countdown
- add lato font
- finish layout
*/

@Component({
    selector: 'app-home',
    standalone: true,
    template: `
    <header class="h-[66vh] bg-white">
      <app-navigation-bar></app-navigation-bar>
      <div>
        <div class="w-full flex flex-col justify-center items-center p-7">
          <p class="font-manuale text-[1.6875rem] font-bold justify-center">YOU'RE</p>
          <p class="font-manuale text-[1.6875rem] font-bold justify-center">INVITED</p>
        </div>
        <div class="w-full flex flex-col justify-center items-center">
          <div class="flex justify-center items-center w-[18rem] h-[6.5rem] bg-primary rounded-md">
            <p class="font-manuale text-[2rem] font-bold text-white">TO THE BIG DAY!</p>
          </div>
        </div>
        <div class="h-[1.75rem]"></div>
        <div class="w-full flex flex-col justify-center items-center">
          <app-countdown></app-countdown>
        </div>
      </div>
    </header>
    <section class="h-[34vh] bg-secondary relative">
      <div class="w-full flex flex-col justify-end items-center absolute top-0 translate-y-[-100%]">
        <p class="font-manuale text-[2rem] font-bold text-primary">LEFT</p>
      </div>
      <div class="w-full flex flex-col justify-end items-center absolute top-0">
        <p class="font-manuale text-[2rem] font-bold text-white">UNTIL</p>
      </div>
      <div class="w-full h-full flex flex-row justify-center items-center text-center">
        <div>
          <p class="justify-center font-marcellus-sc text-white text-[2rem] font-[450]">Kamal & Faiza's WEDDING</p>
        </div>
        <div>
          <p></p>
        </div>
      </div>
    </section>
    <section>
      <p class="text-3xl font-manuale">
        Hello world!
      </p>
      <p class="text-3xl font-marcellus-sc">
        Hello world!
      </p>
      <p class="text-3xl font-major-mono-display">
        Hello world!
      </p>
      <p class="text-3xl font-manuale">
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
        Hello world! Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!Hello world!
      </p>
    </section>
  `,
    styleUrl: './home.component.css',
    imports: [NavigationBarComponent, CountdownComponent]
})
export class HomeComponent {

}
