import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../logger.service';
import { Message, MessageService } from '../message.service';
import { Invitation, WeddingService } from '../wedding.service';
import { Subscription } from 'rxjs';

type MessageState = {
  name: string;
  message: string;
  status?: undefined | 'sending' | 'sent' | 'error';
  anonymousMode: boolean;
};

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule, NgClass],
  template: `
    <div>
      <div class="relative flex w-full flex-col items-center gap-2">
        <p class="text-md font-manuale text-white">Leave a message or wishes for the bride and groom!</p>
        <form
          class="flex w-full flex-col gap-2 text-sm md:text-[1rem]"
          (submit)="onSubmitMessage($event)"
          [ngClass]="state.status == 'sending' ? ['pointer-events-none', 'opacity-60'] : ''"
        >
          <div class="flex flex-col">
            <label for="name">
              <input
                id="name"
                class="w-full appearance-none rounded border border-transparent bg-slate-100 px-3.5 py-2.5 font-manuale text-slate-600 outline-none selection:bg-indigo-600 selection:text-white hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 disabled:opacity-70"
                type="text"
                placeholder="From"
                maxlength="40"
                [(ngModel)]="state.name"
                [ngModelOptions]="{ standalone: true }"
                (ngModelChange)="state.name = $event"
                [disabled]="!state.anonymousMode"
              />
            </label>
            <label
              for="anonymousCheck"
              class="ml-1 flex flex-row items-center gap-1"
              [ngClass]="invitation ? '' : 'hidden'"
            >
              <input id="anonymousCheck" name="anonymousCheck" [(ngModel)]="state.anonymousMode" type="checkbox" />
              <p class="font-manuale text-sm text-white">sent under a different name</p>
            </label>
          </div>
          <div class="flex flex-col">
            <div
              class="grid overflow-hidden after:invisible after:whitespace-pre-wrap after:border after:px-3.5 after:py-2.5 after:text-inherit after:content-[attr(data-cloned-val)_'_'] after:[grid-area:1/1/2/2] [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:text-inherit [&>textarea]:[grid-area:1/1/2/2]"
            >
              <textarea
                class="w-full appearance-none text-wrap break-all rounded border border-transparent bg-slate-100 px-3.5 py-2.5 font-manuale text-slate-600 outline-none selection:bg-indigo-600 selection:text-white hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                name="message"
                id="message"
                rows="2"
                onInput="this.parentNode.dataset.clonedVal = this.value"
                placeholder="Message..."
                [maxlength]="kCharactersLimit"
                [(ngModel)]="state.message"
                required
              ></textarea>
            </div>
            <p class="ml-1 font-manuale text-sm text-white">
              {{ state.message.length }}/{{ kCharactersLimit }} characters
            </p>
          </div>
          <button
            class="select-none rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-white hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
            type="submit"
          >
            Submit
          </button>
        </form>
        <div
          class="pointer-events-none absolute flex h-full w-full items-center justify-center"
          [ngClass]="state.status == 'sending' ? '' : 'hidden'"
        >
          <div class="size-8 fill-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.5s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </path>
            </svg>
          </div>
        </div>
        <div class="pointer-events-none absolute flex h-full w-full items-center justify-center">
          <div
            class="fill-mode-forwards invisible rounded-lg border-2 border-black bg-secondary px-3 py-5 shadow-lg"
            [ngClass]="state.status == 'sent' ? 'animate-notify-scale-in' : 'hidden'"
          >
            <p class="text-md font-manuale text-white">Message sent, thanks!</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './message.component.css',
})
export class MessageComponent {
  kCharactersLimit = 400;

  logger = inject(LoggerService);
  messageService = inject(MessageService);
  weddingService = inject(WeddingService);

  invitation?: Invitation | undefined;
  loading = true;

  subscriptions: Subscription[] = [];

  state: MessageState = {
    name: '',
    message: '',
    anonymousMode: true,
  };

  ngOnInit() {
    this.subscriptions.push(
      this.weddingService.invitation.subscribe((data) => {
        const nextLoading = data.status == 'loading';
        this.invitation = data.invitation;
        this.loading = nextLoading;
        if (this.invitation) {
          this.state.name = this.invitation.name;
          this.state.anonymousMode = false;
        }
      }),
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onSubmitMessage(event: SubmitEvent) {
    this.logger.debug('Send message:', this.state.name, this.state.message);
    if (this.state.message.length == 0) {
      window.alert("message can't be empty.");
    } else {
      this.state.status = 'sending';
      this.messageService
        .sendMessage(this.state.name, this.state.message)
        .subscribe({
          next: (res) => {
            const { data } = res as { data: Message };
            this.state.status = 'sent';
          },
          error: () => {
            this.state.status = 'error';
          },
        })
        .add(() => {
          this.state.name = '';
          this.state.message = '';
        });
    }
  }
}
