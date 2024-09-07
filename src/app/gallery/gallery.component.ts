import { NgClass, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  signal,
} from '@angular/core';
import { LoggerService } from '../logger.service';
import { Subscription } from 'rxjs';

export type GalleryContent = {
  title: string;
  imageUrl?: string;
};

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="relative flex w-full flex-col justify-center overflow-hidden">
      <button
        class="absolute left-0 top-[50%] z-10 flex h-[3rem] w-[2rem] translate-y-[-50%] items-center justify-center bg-black opacity-20 hover:opacity-30 active:hover:opacity-50"
        #galleryPrev
        (click)="onChangeIndex(-1)"
        [disabled]="contentControlDisable"
      >
        <div
          class="relative size-0 translate-x-[-12%] border-y-[1rem] border-r-[1rem] border-y-transparent border-r-white"
        ></div>
      </button>
      <button
        class="absolute right-0 top-[50%] z-10 flex h-[3rem] w-[2rem] translate-y-[-50%] items-center justify-center bg-black opacity-20 hover:opacity-30 active:hover:opacity-50"
        #GalleryNext
        (click)="onChangeIndex(1)"
        [disabled]="contentControlDisable"
      >
        <div
          class="relative size-0 translate-x-[12%] border-y-[1rem] border-l-[1rem] border-y-transparent border-l-white"
        ></div>
      </button>
      <div class="relative mx-2 flex flex-row justify-start overflow-x-hidden scroll-smooth" #galleryScroll>
        <div class="relative my-5 flex flex-row gap-0" #galleryContainer>
          @for (content of contents!; track content; let id = $index) {
            <div
              class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
              [ngClass]="content.imageUrl"
              [id]="'content-dummy1-' + id"
            ></div>
          }
          @for (content of contents!; track content; let id = $index) {
            <div
              class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
              [ngClass]="content.imageUrl"
              [id]="'content-' + id"
              (click)="onOpenContent(content)"
              #galleryContent
            ></div>
          }
          @for (content of contents!; track content; let id = $index) {
            <div
              class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
              [ngClass]="content.imageUrl"
              [id]="'content-dummy2-' + id"
            ></div>
          }
        </div>
      </div>
    </div>
    <div class="mt-10 flex w-full flex-row justify-center gap-2">
      <div class="flex flex-row gap-2">
        @for (content of contents; track content; let id = $index) {
          <div
            class="z-20 size-2 rounded-full shadow-md"
            [ngClass]="id === currentId ? 'bg-gray-500' : 'bg-gray-300'"
            (click)="onChangeIndex(id - currentId)"
          ></div>
        }
      </div>
    </div>
  `,
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnDestroy {
  // Model related members
  logger = inject(LoggerService);
  contents: GalleryContent[] = [
    {
      title: '1',
      imageUrl: 'bg-gray-100',
    },
    {
      title: '2',
      imageUrl: 'bg-gray-200',
    },
    {
      title: '3',
      imageUrl: 'bg-gray-300',
    },
    {
      title: '4',
      imageUrl: 'bg-gray-400',
    },
    {
      title: '5',
      imageUrl: 'bg-gray-500',
    },
    {
      title: '6',
      imageUrl: 'bg-gray-600',
    },
  ];
  currentId: number = 0;
  subscriptions: Subscription[] = [];
  @Output() onOpenEvent = new EventEmitter<GalleryContent>();

  // View related members
  @ViewChild('galleryScroll') galleryScroll!: ElementRef;
  @ViewChild('galleryContainer') galleryContainer!: ElementRef;
  @ViewChildren('galleryContent') contentsQuery!: QueryList<ElementRef>;
  contentControlDisable: boolean = false;

  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      this.onChangeIndex(0);
      this.contentsQuery.reset(
        this.contentsQuery.toArray().sort((a, b) => {
          if (a.nativeElement.id === b.nativeElement.id) return 0;
          if (a.nativeElement.id < b.nativeElement.id) return -1;
          return 1;
        }),
      );
      this.subscriptions.push(
        this.contentsQuery.changes.subscribe((current: QueryList<ElementRef>) => {
          this.contentsQuery.reset(
            current.toArray().sort((a, b) => {
              if (a.nativeElement.id === b.nativeElement.id) return 0;
              if (a.nativeElement.id < b.nativeElement.id) return -1;
              return 1;
            }),
          );
        }),
      );
    }
  }

  scrollContentToCenter(offset = 0, behavior = 'smooth') {
    this.contentControlDisable = true;
    const scrollElement = this.galleryScroll.nativeElement;
    const containerElement = this.galleryContainer.nativeElement;
    this.logger.debug(
      `[gallery] offset ${offset}, scroll window ${scrollElement.offsetWidth}, container ${containerElement.offsetWidth}`,
    );
    scrollElement.scrollTo({
      left: containerElement.offsetWidth / 2 - scrollElement.offsetWidth / 2 + offset,
      top: 0,
      behavior: behavior,
    });
    setTimeout(() => (this.contentControlDisable = false), 500);
  }

  onChangeIndex(delta: number) {
    if (this.contentControlDisable) return;
    const defaultOffset = this.contents.length % 2 == 0 ? -this.getContentSize() / 2 : 0;
    this.contentControlDisable = true;
    delta = delta % this.contents.length;
    if (Math.abs(delta) > this.contents.length / 2) {
      if (delta > 0) {
        delta -= this.contents.length;
      } else {
        delta += this.contents.length;
      }
    }
    this.currentId = (this.currentId + delta + this.contents.length) % this.contents.length;
    const scrollElement = this.galleryScroll.nativeElement;
    if (delta >= 0) {
      const prefix = this.contents.slice(delta, this.contents.length);
      const suffix = this.contents.slice(0, delta);
      this.contents = [...prefix, ...suffix];
    } else {
      const prefix = this.contents.slice(this.contents.length + delta, this.contents.length);
      const suffix = this.contents.slice(0, this.contents.length + delta);
      this.contents = [...prefix, ...suffix];
    }
    this.scrollContentToCenter(this.getContentSize() * -delta + defaultOffset, 'instant');
    this.scrollContentToCenter(defaultOffset);
    setTimeout(() => (this.contentControlDisable = false), 700);
  }

  getContentSize() {
    let ret = Infinity;
    for (let i = 0; i < this.contentsQuery.length; i++) {
      const cur: HTMLElement = this.contentsQuery.get(i)?.nativeElement;
      const next: HTMLElement = this.contentsQuery.get((i + 1) % this.contentsQuery.length)?.nativeElement;
      if (next.offsetLeft > cur.offsetLeft) {
        ret = Math.min(ret, next.offsetLeft - cur.offsetLeft);
      }
    }
    return ret;
  }

  onOpenContent(content: GalleryContent) {
    this.onOpenEvent.emit(content);
  }
}
