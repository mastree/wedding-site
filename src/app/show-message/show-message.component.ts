import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Message, WeddingService } from '../wedding.service';
import { LoggerService } from '../logger.service';
import { create } from 'domain';
import { NgClass } from '@angular/common';
import { Subscriber, Subscription } from 'rxjs';

type State = {
  messages: Message[];
  page: number;
  pageSize?: number;
  messageSize?: number;
  loading: boolean;
  status?: undefined | 'success' | 'error';
};

@Component({
  selector: 'app-show-message',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="relative flex w-full flex-col items-center justify-center gap-8"
      [ngClass]="state.loading ? 'opacity-60' : ''"
    >
      <p class="text-md font-manuale text-white">Messages from You!</p>
      <div class="flex w-full flex-col justify-center gap-5">
        @if (state.status == 'success') {
          @for (message of state.messages; track message.id) {
            <div class="flex flex-col rounded-b-lg rounded-r-lg bg-white p-2 text-primary drop-shadow-md">
              <div class="flex flex-row justify-between">
                <p class="font-manuale font-semibold">From: {{ message.name }}</p>
                <p class="font-manuale font-light">{{ getTimeString(message.created_at) }}</p>
              </div>
              <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
              <p class="min-h-16 font-lato">{{ message.message }}</p>
            </div>
          }
        } @else {}
      </div>

      <button
        class="absolute right-0 top-0 rounded-md bg-white px-5 py-2 font-semibold drop-shadow-md active:bg-slate-200 active:shadow-inner active:ring-2 active:ring-sky-400"
        (click)="onRefresh()"
      >
        <p class="font-manuale text-sm text-primary">Refresh</p>
      </button>

      <div
        class="pointer-events-none absolute z-10 flex items-center justify-center opacity-100"
        [ngClass]="state.loading ? '' : 'hidden'"
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
    </div>
  `,
  styleUrl: './show-message.component.css',
})
export class ShowMessageComponent implements OnInit, OnDestroy {
  private kPageSize = 8;

  logger = inject(LoggerService);
  weddingService = inject(WeddingService);

  state: State = {
    messages: [],
    page: 0,
    pageSize: this.kPageSize,
    loading: false,
  };

  subscription: Subscription | undefined;

  constructor() {
    this.state.loading = true;
  }

  ngOnInit() {
    this.subscription = this.weddingService.getMessage(this.state.page, this.kPageSize).subscribe({
      next: (res) => {
        console.log(`getMessage: ${JSON.stringify(res)}`);
        const { data, error } = res as { data: Message[]; error: boolean };
        this.state.messages = data;
        this.state.status = error ? 'error' : 'success';
        this.state.loading = false;
      },
      error: (err) => {
        this.logger.error(`Error get message: ${JSON.stringify(err)}`);
        this.state.status = 'error';
        this.state.loading = false;
      },
    });
    this.onRefresh();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  getTimeString(created_at: number) {
    return new Date(created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  }

  onRefresh() {
    this.state.loading = true;
    this.state.status = undefined;
    this.weddingService.signalRefreshMessage();
  }
}
