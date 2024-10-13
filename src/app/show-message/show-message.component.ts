import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  QueryList,
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
      <div class="relative flex w-full select-none items-center justify-center" #container>
        <div
          [class]="contentBaseClasses"
          (pointerdown)="pauseContentChange()"
          (pointerup)="resumeContentChange()"
          (mouseleave)="resumeContentChange()"
          (touchend)="resumeContentChange()"
          id="primary"
          #content
        >
          <img
            src="flower-deco-angle.png"
            class="absolute bottom-0 right-0 h-[70%] max-h-[8rem] translate-x-[10%] translate-y-[30%] scale-[-100%]"
          />
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
          <img
            src="flower-deco-angle.png"
            class="absolute bottom-0 right-0 h-[70%] max-h-[8rem] translate-x-[10%] translate-y-[30%] scale-[-100%]"
          />
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
          <img
            src="flower-deco-angle.png"
            class="absolute bottom-0 right-0 h-[70%] max-h-[8rem] translate-x-[10%] translate-y-[30%] scale-[-100%]"
          />
          <p class="font-manuale font-semibold">QS. Az-Zariyat Ayat 49</p>
          <div class="mb-2 h-[0.5px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full p-1 md:p-2">
            <p class="min-h-16 font-lato">
              "Dan segala sesuatu Kami ciptakan berpasang-pasangan supaya kamu mengingat kebesaran Allah."
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-2">
        @for (content of contents!; track content; let id = $index) {
          <div
            class="z-20 size-2 rounded-full shadow-md"
            [ngClass]="id === currentId ? 'bg-white' : 'bg-gray-400'"
            (click)="selectContentId(id)"
          ></div>
        }
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
              class="select-none rounded-md bg-white px-5 py-2 font-semibold drop-shadow-md hover:ring-2 active:bg-slate-200 active:shadow-inner active:ring-2 active:ring-sky-400 disabled:pointer-events-none disabled:opacity-60"
              [disabled]="state.page <= minPage"
              (click)="changePage(state.page - 1)"
            >
              <p class="font-manuale text-sm font-semibold text-primary">< prev</p>
            </button>
            <button
              class="select-none rounded-md bg-white px-5 py-2 font-semibold drop-shadow-md hover:ring-2 active:bg-slate-200 active:shadow-inner active:ring-2 active:ring-sky-400 disabled:pointer-events-none disabled:opacity-60"
              [disabled]="state.page >= maxPage"
              (click)="changePage(state.page + 1)"
            >
              <p class="font-manuale text-sm font-semibold text-primary">next ></p>
            </button>

            <button
              class="absolute right-0 top-0 select-none rounded-md bg-primary p-3 font-semibold drop-shadow-md hover:ring-2 active:bg-light-primary active:shadow-inner active:ring-2 active:ring-white"
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
              @if (state.messages.length == 0) {
                <div class="my-5 flex w-full flex-col items-center justify-center">
                  <div class="flex items-center justify-center">
                    <svg class="opacity-30" width="64" height="53" viewBox="0 0 64 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M19 0C8.50659 0 0 8.50659 0 19V25C0 32.0883 3.88161 38.2701 9.63518 41.5356L8.06438 52.7825L19.5499 44H45C55.4934 44 64 35.4934 64 25V19C64 8.50659 55.4934 0 45 0H19Z"
                        class="fill-white"
                      />
                    </svg>
                    <p class="absolute font-manuale text-white">...</p>
                  </div>
                  <p class="pointer-events-none select-none font-manuale font-semibold text-white drop-shadow-md">
                    No message to show!
                  </p>
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
  private renderInterval: NodeJS.Timeout | undefined;
  private lastContentChangeTime = 0;
  private pauseStart = 0;
  currentId = 0;
  contentIdSelect = -1;
  contentBaseClasses =
    'pointer-events-none absolute top-0 flex w-full flex-col rounded-b-lg rounded-r-lg bg-amber-100 ' +
    'p-2 text-primary opacity-0 shadow-lg shadow-pink-400/50 scale-50 transition-all duration-1000';

  resizeObservable$: Observable<Event> | undefined;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
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
    this.logger.debug(`addClasses(${element}, ${classes})`);
    classes.forEach((cls) => {
      element.classList.toggle(cls, true);
    });
  }

  private removeClasses(element: any, classes: string[]) {
    this.logger.debug(`removeClasses(${element}, ${classes})`);
    classes.forEach((cls) => {
      element.classList.toggle(cls, false);
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
    // Add 5px for the shadow
    this.setHeight(container.nativeElement, containerHeight + 5);
  }

  private async wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      // Correct the content order for the first time immediately
      this.contents.reset(
        this.contents
          .toArray()
          .sort((a, b) => Number(b.nativeElement.id === 'primary') - Number(a.nativeElement.id === 'primary')),
      );
      this.subscriptions.push(
        this.contents.changes.subscribe((current: QueryList<ElementRef>) => {
          this.contents.reset(
            current
              .toArray()
              .sort((a, b) => Number(b.nativeElement.id === 'primary') - Number(a.nativeElement.id === 'primary')),
          );
        }),
      );
    }
    this.updateHeight();
    const intervalMillis = 5000;
    this.lastContentChangeTime = new Date().valueOf();
    this.contentIntervalFunction(0);
    if (this.isBrowser()) {
      this.renderInterval = setInterval(() => {
        const currentMillis = new Date().valueOf();
        if (
          0 <= this.contentIdSelect &&
          this.contentIdSelect < this.contents.length &&
          this.contentIdSelect != this.currentId
        ) {
          const contentIdSelect = this.contentIdSelect;
          this.lastContentChangeTime = currentMillis;
          this.contentIntervalFunction(contentIdSelect);
        }
        this.contentIdSelect = -1;
        if (this.pauseStart == 0 && currentMillis - this.lastContentChangeTime >= intervalMillis) {
          this.lastContentChangeTime = currentMillis;
          this.contentIntervalFunction();
        }
      }, 100);
      this.resizeObservable$ = fromEvent(window, 'resize');
      this.subscriptions.push(this.resizeObservable$.subscribe((e) => this.updateHeight()));
    }
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

  async contentIntervalFunction(nextId = -1) {
    const { contents } = this;
    if (nextId == -1) {
      nextId = (this.currentId + 1) % contents.length;
    }
    const nextElement = contents.get(nextId)?.nativeElement;
    for (let i = 0; i < contents.length; i++) {
      const selectElement = contents.get(i)?.nativeElement;
      this.removeClasses(selectElement, [`scale-100`]);
      this.addClasses(selectElement, [`opacity-0`, `scale-50`]);
      if (i == this.currentId) await this.wait(1000);
      this.addClasses(selectElement, [`pointer-events-none`]);
    }
    this.removeClasses(nextElement, [`opacity-0`, `scale-50`, `pointer-events-none`]);
    this.addClasses(nextElement, [`scale-100`]);
    this.currentId = nextId;
    this.changeDetectorRef.detectChanges();
  }

  selectContentId(contentId: number) {
    this.contentIdSelect = contentId;
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
