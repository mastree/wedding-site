import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-countdown',
  standalone: true,
  template: `
    <div class="flex flex-col items-center">
      <p class="font-manuale text-[1rem] font-bold p-2">countdown</p>
      <div class="flex flex-row gap-7">
        <app-counter [tick]="days" title="DAYS"></app-counter>
        <app-counter [tick]="hours" title="HOURS"></app-counter>
      </div>
    </div>
  `,
  styleUrl: './countdown.component.css',
  imports: [CounterComponent],
})
export class CountdownComponent {
  days: number = 9;
  hours: number = 14;
}
