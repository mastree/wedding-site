import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-row items-center rounded-lg min-h-40 p-5 w-[90%] bg-slate-100 shadow-md">
      <div class="h-full min-w-[25%] max-w-[35%] flex flex-col justify-center items-center">
        <img class="max-h-32 max-w-[4.5rem]" [src]="icon" />
      </div>
      <div class="grow flex flex-col gap-2 pl-3 h-full items-center justify-center">
        <div class="grow flex justify-center items-center">
          <p class="font-manuale font-semibold text-xl">{{ title }}</p>
        </div>
        <div class="grow-[2] w-full">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() icon: string = "";
  @Input() title: string = "";
}
