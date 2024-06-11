import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-lg h-[35%] w-[90%] bg-slate-100 shadow-md"></div>
  `,
  styleUrl: './card.component.css',
})
export class CardComponent {

}
