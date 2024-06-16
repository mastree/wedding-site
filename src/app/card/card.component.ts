import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div class="flex min-h-40 w-[90%] flex-row items-center rounded-lg bg-slate-100 p-5 shadow-lg">
      <div class="flex h-full min-w-[25%] max-w-[35%] flex-col items-center justify-center">
        <img class="max-h-32 max-w-[4.5rem]" [src]="icon" />
      </div>
      <div class="flex h-full grow flex-col items-center justify-center gap-2 pl-3">
        <div class="flex grow items-center justify-center">
          <p class="font-manuale text-xl font-semibold">{{ title }}</p>
        </div>
        <div class="w-full grow-[2]">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
}
