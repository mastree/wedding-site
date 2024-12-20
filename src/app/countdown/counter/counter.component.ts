import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  template: `
    <div class="text-primary">
      <div
        class="flex flex-row items-center justify-center gap-1 font-major-mono-display text-[2rem] font-[500] md:text-[3rem] lg:text-[4rem]"
      >
        @for (digit of digits; track $index) {
          <div class="relative flex items-center justify-center">
            <div class="absolute z-10 flex h-full w-full items-center justify-center">
              <p>
                {{ digit }}
              </p>
            </div>
            <div class="relative">
              <svg
                class="m-0 h-[3rem] w-[1.875rem] md:h-[4rem] md:w-[2.5rem] lg:h-[5rem] lg:w-[3.125rem]"
                viewBox="0 0 50 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M49.1235 1.50103L40.1997 3.77062L49.63 2.31741C49.8674 2.82888 50 3.39896 50 4V36C50 37.285 49.3941 38.4285 48.4523 39.1603L31 40L48.4523 40.8397C49.3941 41.5715 50 42.715 50 44V76C50 78.2091 48.2091 80 46 80H4C1.79086 80 0 78.2091 0 76V44C0 42.715 0.605945 41.5715 1.54769 40.8397L19 40L1.54769 39.1603C0.605944 38.4285 0 37.285 0 36V4C0 1.79086 1.79086 0 4 0H46C47.2637 0 48.3905 0.585976 49.1235 1.50103Z"
                  fill="#B9B9B9"
                />
              </svg>
            </div>
          </div>
        }
      </div>
      <div class="flex w-full items-center justify-center">
        <p class="font-manuale text-[0.75rem] md:text-[1rem]">{{ title }}</p>
      </div>
    </div>
  `,
  styleUrl: './counter.component.css',
})
export class CounterComponent implements OnChanges {
  @Input({
    transform: (value: any) => {
      if (typeof value === 'number') {
        return Math.round(value);
      }
      return parseInt(value);
    },
  })
  tick!: number;
  @Input() title: string = '';
  digits: number[] = [0, 0];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const tickChange = changes['tick'];
    if (tickChange) {
      let { currentValue } = tickChange;
      let nextDigits = [];
      while (currentValue > 0 || nextDigits.length < 2) {
        nextDigits.push(currentValue % 10);
        currentValue = Math.floor(currentValue / 10);
      }
      this.digits = nextDigits.reverse();
    }
  }
}
