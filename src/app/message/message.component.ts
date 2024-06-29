import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex w-full flex-col items-center gap-2">
      <p class="text-md font-manuale text-white">Leave a message or wishes for the bride and groom!</p>
      <form class="flex w-full flex-col gap-2" (submit)="onSubmitMessage($event)">
        <div
          class="grid overflow-hidden text-sm after:invisible after:whitespace-pre-wrap after:border after:px-3.5 after:py-2.5 after:text-inherit after:content-[attr(data-cloned-val)_'_'] after:[grid-area:1/1/2/2] [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:text-inherit [&>textarea]:[grid-area:1/1/2/2]"
        >
          <textarea
            class="w-full appearance-none text-wrap break-all rounded border border-transparent bg-slate-100 px-3.5 py-2.5 font-manuale text-slate-600 outline-none selection:bg-indigo-600 selection:text-white hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            name="message"
            id="message"
            rows="2"
            onInput="this.parentNode.dataset.clonedVal = this.value"
            placeholder="Message..."
            [(ngModel)]="messageText"
            required
          ></textarea>
        </div>
        <button
          class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white active:bg-light-primary active:shadow-inner active:shadow-primary md:p-3"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  `,
  styleUrl: './message.component.css',
})
export class MessageComponent {
  logger = inject(LoggerService);
  messageText: string = '';

  onSubmitMessage(event: SubmitEvent) {
    this.logger.debug(this.messageText);
  }
}
