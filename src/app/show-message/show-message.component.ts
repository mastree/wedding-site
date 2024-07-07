import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { LoggerService } from '../logger.service';
import { NgClass, isPlatformBrowser } from '@angular/common';
import { Message, MessageService } from '../message.service';
import { Observable, Subscription, fromEvent } from 'rxjs';

type State = {
  messages: Message[];
  page: number;
  pageSize?: number;
  messageSize?: number;
  loading: boolean;
  status?: undefined | 'loading' | 'success' | 'error';
};

@Component({
  selector: 'app-show-message',
  standalone: true,
  imports: [NgClass],
  template: `
    <div
      class="pointer-events-none pointer-events-auto hidden scale-0 scale-100 opacity-0 opacity-100"
      #dummyClass
    ></div>
    <div class="relative flex w-full flex-col items-center justify-center gap-12">
      <div class="relative flex w-full select-none items-center justify-center overflow-clip" #container>
        <div
          [class]="contentBaseClasses"
          (pointerdown)="pauseContentChange()"
          (pointerup)="resumeContentChange()"
          (mouseleave)="resumeContentChange()"
          (touchend)="resumeContentChange()"
          #content
        >
          <p class="font-manuale font-semibold">From: Faiza & Kamal</p>
          <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full p-1 md:p-2">
            <p class="mb-2 font-lato">Assalamu'alaikum Wr Wb</p>
            <p class="min-h-16 font-lato">
              Terima kasih atas waktu yang telah disisihkan oleh Bapak/Ibu. Kami berharap acara pernikahan kami dapat
              berjalan lancar serta membawa keberkahan dan kebahagian bagi kita semua. Untuk itu kami meminta doa restu
              dari Bapak/Ibu, agar acara dan kehidupan pernikahan kami dapat berjalan dengan baik dan lancar 😊
            </p>
          </div>
        </div>
        <div
          [class]="contentBaseClasses"
          (pointerdown)="pauseContentChange()"
          (pointerup)="resumeContentChange()"
          (mouseleave)="resumeContentChange()"
          (touchend)="resumeContentChange()"
          #content
        >
          <p class="font-manuale font-semibold">QS. An-Nisa' Ayat 1</p>
          <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full p-1 md:p-2">
            <p class="min-h-16 font-lato">
              "Hai manusia, bertakwalah kepada Tuhan-mu yang menciptakan kamu dari satu jiwa, dan darinya Dia
              menciptakan jodohnya, dan mengembang-biakan dari keduanya banyak laki-laki dan perempuan; dan bertakwalah
              kepada Allah SWT yang dengan nama-Nya kamu saling bertanya, terutama mengenai hubungan tali kekerabatan.
              Sesungguhnya Allah SWT adalah pengawas atas kamu."
            </p>
          </div>
        </div>
        <div
          [class]="contentBaseClasses"
          (pointerdown)="pauseContentChange()"
          (pointerup)="resumeContentChange()"
          (mouseleave)="resumeContentChange()"
          (touchend)="resumeContentChange()"
          #content
        >
          <p class="font-manuale font-semibold">QS. Az-Zariyat Ayat 49</p>
          <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full p-1 md:p-2">
            <p class="min-h-16 font-lato">
              "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah."
            </p>
          </div>
        </div>
      </div>
      <div class="relative flex w-full flex-col items-center justify-center">
        <div
          class="pointer-events-none absolute top-0 z-10 flex h-full max-h-[100vh] w-full items-center justify-center"
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
        <div
          class="relative flex w-full flex-col items-center justify-center gap-8"
          [ngClass]="state.loading ? ['pointer-events-none', 'opacity-60'] : ''"
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
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './show-message.component.css',
})
export class ShowMessageComponent implements OnInit, OnDestroy, AfterViewInit {
  private kPageSize = 5;

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

  isBrowser = signal(false);

  // View related members
  @ViewChild('container') container!: ElementRef;
  @ViewChildren('content') contents!: QueryList<ElementRef>;
  @Inject({})
  private renderer = inject(Renderer2);
  private renderInterval: NodeJS.Timeout | undefined;
  private currentId = 0;
  private lastContentChangeTime = 0;
  private pauseStart = 0;
  contentBaseClasses =
    'pointer-events-none absolute top-0 flex w-full flex-col rounded-b-lg rounded-r-lg bg-amber-100 ' +
    'p-2 text-primary opacity-0 shadow-lg shadow-pink-400/50';

  resizeObservable$: Observable<Event> | undefined;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  ngOnInit() {
    this.subscriptions.push(
      this.messageService.pageData.subscribe((data) => {
        this.logger.debug(`pageData updated ${JSON.stringify(data)}`);
        this.state.messages = data.messages;
        this.state.page = data.pagination.page;
        this.state.pageSize = data.pagination.pageSize;
        this.state.loading = data.status == 'loading';
        this.state.status = data.status;
        this.state.messageSize = data.dataSize;
      }),
    );
    this.changePage(0);
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    clearInterval(this.renderInterval);
  }

  private addClasses(element: any, classes: string[]) {
    classes.forEach((cls) => {
      this.renderer.addClass(element, cls);
    });
  }

  private removeClasses(element: any, classes: string[]) {
    classes.forEach((cls) => {
      this.renderer.removeClass(element, cls);
    });
  }

  private setHeight(element: any, height: number) {
    element.setAttribute('style', `height:${height}px`);
    element.style.height = `height:${height}px`;
  }

  private updateHeight() {
    const { container, contents } = this;
    let containerHeight = 0;
    for (let i = 0; i < contents.length; i++) {
      const content = contents.get(i);
      const height = content?.nativeElement.offsetHeight;
      if (height > containerHeight) {
        containerHeight = height;
      }
    }
    this.setHeight(container.nativeElement, containerHeight);
  }

  private async wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
  }

  ngAfterViewInit() {
    const { container, contents } = this;
    const children = container.nativeElement.children;
    this.logger.debug(`[kamalshafi] container child size: ${children.length}`);
    this.logger.debug(`[kamalshafi] contents size: ${contents.length}`);
    this.updateHeight();
    for (let i = 0; i < contents.length; i++) {
      const content = contents.get(i);
      this.addClasses(content?.nativeElement, [`scale-50`, `transition-all`, `duration-1000`]);
    }
    const intervalFunc = async (firstCall = false) => {
      const prevId = (this.currentId - 1 + contents.length) % contents.length;
      const nextId = (this.currentId + 1) % contents.length;
      if (!firstCall) {
        this.logger.debug(`[kamalshafi] prevId ${prevId}, currentId ${this.currentId}, nextId ${nextId}`);
        this.removeClasses(contents.get(prevId)?.nativeElement, [`scale-100`]);
        this.addClasses(contents.get(prevId)?.nativeElement, [`opacity-0`, `scale-50`]);
        await this.wait(1000);
        this.addClasses(contents.get(prevId)?.nativeElement, [`pointer-events-none`]);
      }
      this.removeClasses(contents.get(this.currentId)?.nativeElement, [`opacity-0`, `scale-50`, `pointer-events-none`]);
      this.addClasses(contents.get(this.currentId)?.nativeElement, [`scale-100`]);
      this.currentId = nextId;
    };
    const intervalMillis = 5000;
    if (this.isBrowser()) {
      intervalFunc(true);
      this.renderInterval = setInterval(() => {
        const currentMillis = new Date().valueOf();
        if (this.pauseStart == 0 && currentMillis - this.lastContentChangeTime >= intervalMillis) {
          this.lastContentChangeTime = currentMillis;
          intervalFunc();
        }
      }, 100);
    }
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.subscriptions.push(this.resizeObservable$.subscribe((e) => this.updateHeight()));
  }

  getTimeString(created_at: number) {
    return new Date(created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
  }

  changePage(page: number) {
    this.logger.info(`change message page: ${this.state.page} -> ${page}`);
    this.messageService.setPage(page, this.kPageSize);
  }

  onRefresh() {
    this.messageService.reload();
  }

  pauseContentChange() {
    this.logger.debug(`[kamalshafi] pause content change`);
    this.pauseStart = new Date().valueOf();
  }

  resumeContentChange() {
    this.logger.debug(`[kamalshafi] resume content change`);
    if (this.pauseStart) {
      const currentMillis = new Date().valueOf();
      this.lastContentChangeTime += currentMillis - this.pauseStart;
      this.pauseStart = 0;
    }
  }

  get minPage() {
    return 0;
  }

  get maxPage() {
    if (!this.state.messageSize) return 0;
    return Math.floor((this.state.messageSize - 1) / this.kPageSize);
  }
}
