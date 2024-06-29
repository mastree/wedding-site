import { Component, Inject, Input, PLATFORM_ID, signal } from '@angular/core';
import { CounterComponent } from './counter/counter.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-countdown',
  standalone: true,
  template: `
    <div class="flex w-[100vw] grow flex-col items-center justify-evenly">
      <p class="font-manuale text-[1rem] font-bold md:text-[1.5rem]">countdown</p>
      <div class="flex w-full justify-center overflow-hidden px-5">
        <div class="flex flex-row gap-4 overflow-x-scroll">
          <app-counter [tick]="days" title="DAYS"></app-counter>
          <app-counter [tick]="hours" title="HOURS"></app-counter>
          <app-counter [tick]="minutes" title="MINUTES"></app-counter>
          <app-counter [tick]="seconds" title="SECONDS"></app-counter>
        </div>
      </div>
    </div>
  `,
  styleUrl: './countdown.component.css',
  imports: [CounterComponent],
})
export class CountdownComponent {
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  currentDate: Date = new Date();

  isBrowser = signal(false);

  private kDayToMillis = 86400 * 1000;
  private kHourToMillis = 60 * 60 * 1000;
  private kMinuteToMillis = 60 * 1000;
  private kSecondToMillis = 1000;

  @Input() eventDate?: Date;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  private updateDaysHours() {
    if (this.eventDate) {
      this.currentDate = new Date();
      let millisecondsGap = this.eventDate.valueOf() - this.currentDate.valueOf();
      this.days = Math.floor(millisecondsGap / this.kDayToMillis);
      millisecondsGap -= this.days * this.kDayToMillis;
      this.hours = Math.floor(millisecondsGap / this.kHourToMillis);
      millisecondsGap -= this.hours * this.kHourToMillis;
      this.minutes = Math.floor(millisecondsGap / this.kMinuteToMillis);
      millisecondsGap -= this.minutes * this.kMinuteToMillis;
      this.seconds = Math.floor(millisecondsGap / this.kSecondToMillis);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      setInterval(() => {
        this.updateDaysHours();
      }, 1000);
    }
  }
}
