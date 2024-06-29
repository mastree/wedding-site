import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { LoggerService } from '../logger.service';
import { NgClass } from '@angular/common';
import { Message, MessageService } from '../message.service';
import { Subscription } from 'rxjs';

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
      <div class="flex w-full flex-row justify-start gap-2">
        <button
          class="rounded-md bg-white px-5 py-2 font-semibold drop-shadow-md active:bg-slate-200 active:shadow-inner active:ring-2 active:ring-sky-400 disabled:pointer-events-none disabled:opacity-60"
          [disabled]="state.page <= minPage"
          (click)="changePage(state.page - 1)"
        >
          <p class="font-manuale text-sm font-semibold text-primary">< prev</p>
        </button>
        <button
          class="rounded-md bg-white px-5 py-2 font-semibold drop-shadow-md active:bg-slate-200 active:shadow-inner active:ring-2 active:ring-sky-400 disabled:pointer-events-none disabled:opacity-60"
          [disabled]="state.page >= maxPage"
          (click)="changePage(state.page + 1)"
        >
          <p class="font-manuale text-sm font-semibold text-primary">next ></p>
        </button>

        <button
          class="absolute right-0 top-0 rounded-md bg-primary p-3 font-semibold drop-shadow-md active:bg-light-primary active:shadow-inner active:ring-2 active:ring-white"
          (click)="onRefresh()"
        >
          <div class="size-4 fill-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"
              />
            </svg>
          </div>
        </button>
      </div>
      <div class="relative flex min-h-48 w-full flex-col justify-center gap-5">
        @if (state.status == 'success') {
          @for (message of state.messages; track message.id) {
            <div class="flex flex-col rounded-b-lg rounded-r-lg bg-white p-2 text-primary drop-shadow-md">
              <div class="flex flex-row justify-between">
                <p class="font-manuale font-semibold">From: {{ message.name }}</p>
                <p class="font-manuale font-light">
                  {{ getTimeString(message.created_at) }} <span class="text-xs">(GMT+7)</span>
                </p>
              </div>
              <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
              <p class="min-h-16 font-lato">{{ message.message }}</p>
            </div>
          }
        }
        <div
          class="pointer-events-none absolute flex h-full w-full items-center justify-center"
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
    </div>
  `,
  styleUrl: './show-message.component.css',
})
export class ShowMessageComponent implements OnInit, OnDestroy {
  private kPageSize = 8;

  logger = inject(LoggerService);
  messageService = inject(MessageService);
  subscriptions: Subscription[] = [];

  state: State = {
    messages: [],
    messageSize: 1,
    page: 0,
    pageSize: this.kPageSize,
    loading: false,
  };

  constructor() {}

  ngOnInit() {
    this.subscriptions.push(
      this.messageService.needReload.subscribe(() => {
        this.refresh();
      }),
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  getTimeString(created_at: number) {
    return new Date(created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  }

  changePage(page: number) {
    this.logger.info(`change message page: ${this.state.page} -> ${page}`);
    this.state.page = page;
    this.onRefresh();
  }

  refresh() {
    this.state.loading = true;
    this.state.status = undefined;
    this.messageService.getMessageSize().subscribe({
      next: (res) => {
        const { data } = res as { data: number };
        this.state.messageSize = data;
        this.logger.info(`current messageSize: ${this.state.messageSize}, maxPage: ${this.maxPage}`);
      },
    });
    this.messageService.getMessage(this.state.page, this.kPageSize).subscribe({
      next: (res) => {
        this.logger.debug(`getMessage(${this.state.page}, ${this.kPageSize})`);
        const { data, error } = res as { data: Message[]; error: boolean };
        this.state.messages = data;
        this.state.status = error ? 'error' : 'success';
        this.state.loading = false;
      },
      error: (err) => {
        this.logger.error(`getMessage(${this.state.page}, ${this.kPageSize})`);
        this.state.status = 'error';
        this.state.loading = false;
      },
    });
  }

  onRefresh() {
    this.messageService.notifyNeedReload();
  }

  get minPage() {
    return 0;
  }

  get maxPage() {
    if (!this.state.messageSize) return 0;
    return Math.floor((this.state.messageSize - 1) / this.kPageSize);
  }
}
