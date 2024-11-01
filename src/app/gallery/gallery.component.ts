import { NgClass, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
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
        (click)="onChangeIndex(-getNumberOfContentsInScrollWindow())"
        [disabled]="contentControlDisable"
      >
        <div
          class="relative size-0 translate-x-[-12%] border-y-[1rem] border-r-[1rem] border-y-transparent border-r-white"
        ></div>
      </button>
      <button
        class="absolute right-0 top-[50%] z-10 flex h-[3rem] w-[2rem] translate-y-[-50%] items-center justify-center bg-black opacity-20 hover:opacity-30 active:hover:opacity-50"
        #GalleryNext
        (click)="onChangeIndex(getNumberOfContentsInScrollWindow())"
        [disabled]="contentControlDisable"
      >
        <div
          class="relative size-0 translate-x-[12%] border-y-[1rem] border-l-[1rem] border-y-transparent border-l-white"
        ></div>
      </button>
      <div class="accelerate relative mx-2 flex flex-row justify-start overflow-x-hidden scroll-smooth" #galleryScroll>
        <div class="relative my-5 flex flex-row gap-0" #galleryContainer>
          @for (content of contents!; track content; let id = $index) {
            @if (id >= contents.length - 3) {
              <div
                class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
                [id]="'content-dummy1-' + id"
                (click)="onOpenContent(id)"
              >
                <img
                  [src]="'compressed-prewed/' + content.imageUrl"
                  class="h-full w-full overflow-hidden rounded-md object-cover"
                  loading="eager"
                  fetchpriority="high"
                  (error)="reloadImage($event)"
                />
              </div>
            }
          }
          @for (content of contents!; track content; let id = $index) {
            <div
              class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
              [id]="'content-' + id"
              (click)="onOpenContent(id)"
              #galleryContent
            >
              <img
                [src]="'compressed-prewed/' + content.imageUrl"
                class="h-full w-full overflow-hidden rounded-md object-cover"
                loading="eager"
                fetchpriority="high"
                (error)="reloadImage($event)"
              />
            </div>
          }
          @for (content of contents!; track content; let id = $index) {
            @if (id < 3) {
              <div
                class="mx-1 h-[24rem] w-[18rem] rounded-md shadow-primary ring-white transition-shadow hover:shadow-lg hover:ring-4 lg:h-[32rem] lg:w-[24rem]"
                [id]="'content-dummy2-' + id"
                (click)="onOpenContent(id)"
              >
                <img
                  [src]="'compressed-prewed/' + content.imageUrl"
                  class="h-full w-full overflow-hidden rounded-md object-cover"
                  loading="eager"
                  fetchpriority="high"
                  (error)="reloadImage($event)"
                />
              </div>
            }
          }
        </div>
      </div>
    </div>
    <div class="mt-10 flex w-full flex-row justify-center gap-2">
      <div class="flex flex-row gap-2">
        @for (content of contents; track content; let id = $index) {
          <div
            class="z-20 size-2 rounded-full"
            [ngClass]="id === currentId ? 'bg-gray-500' : 'bg-gray-300'"
            (click)="onChangeIndex(id - currentId)"
          ></div>
        }
      </div>
    </div>

    <div
      class="fixed left-0 top-0 z-50 m-0 flex h-full min-h-screen w-screen items-center justify-center overflow-auto bg-transparent p-0"
      [ngClass]="selectedGallery === undefined ? 'hidden' : ''"
      #galleryModal
    >
      <div class="relative z-10 mx-5 h-[90vh] max-w-screen-lg opacity-100">
        <div class="relative flex h-full w-full flex-col justify-center bg-transparent" #modalContent>
          <button
            class="absolute left-0 top-[50%] z-20 flex h-[3rem] w-[2rem] translate-y-[-50%] items-center justify-center bg-white opacity-20 hover:opacity-30 active:hover:opacity-50"
            #galleryPrev
            (click)="onChangeOpenContentIndex(-1)"
            [disabled]="contentControlDisable"
          >
            <div
              class="relative size-0 translate-x-[-12%] border-y-[1rem] border-r-[1rem] border-y-transparent border-r-black"
            ></div>
          </button>
          <button
            class="absolute right-0 top-[50%] z-20 flex h-[3rem] w-[2rem] translate-y-[-50%] items-center justify-center bg-white opacity-20 hover:opacity-30 active:hover:opacity-50"
            #GalleryNext
            (click)="onChangeOpenContentIndex(1)"
            [disabled]="contentControlDisable"
          >
            <div
              class="relative size-0 translate-x-[12%] border-y-[1rem] border-l-[1rem] border-y-transparent border-l-black"
            ></div>
          </button>

          <div class="relative w-full">
            <button
              class="pointer-events-auto absolute right-0 top-0 translate-y-[-110%] bg-black bg-opacity-30 px-2 py-0 font-manuale text-xl text-white hover:bg-opacity-50"
              (click)="onCloseGalleryModal()"
            >
              x
            </button>
          </div>
          <img
            [src]="'compressed-prewed/' + selectedGallery?.imageUrl"
            class="animate-scale-in-from-40 animate-very-fast relative max-h-full max-w-full overflow-hidden object-contain"
            loading="lazy"
            fetchpriority="high"
          />
        </div>
      </div>
      <div class="-z-1 absolute left-0 top-0 h-screen w-screen overflow-auto bg-black opacity-70" #galleryModal></div>
    </div>
  `,
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnDestroy {
  // Model related members
  logger = inject(LoggerService);
  @Inject({})
  private renderer = inject(Renderer2);

  contents: GalleryContent[] = [
    {
      title: '0',
      imageUrl: 'IMG_0151.jpg',
    },
    {
      title: '1',
      imageUrl: 'IMG_0163.jpg',
    },
    {
      title: '2',
      imageUrl: 'IMG_0191.jpg',
    },
    {
      title: '3',
      imageUrl: 'IMG_0196.jpg',
    },
    {
      title: '4',
      imageUrl: 'IMG_0214.jpg',
    },
    {
      title: '5',
      imageUrl: 'IMG_0306.jpg',
    },
    {
      title: '6',
      imageUrl: 'IMG_0317-2.jpg',
    },
    {
      title: '7',
      imageUrl: 'IMG_0368.jpg',
    },
    {
      title: '8',
      imageUrl: 'IMG_0381.jpg',
    },
    {
      title: '9',
      imageUrl: 'IMG_0395.jpg',
    },
  ];
  currentId: number = 0;
  subscriptions: Subscription[] = [];
  selectedGallery?: GalleryContent | undefined;
  selectedGalleryId: number = -1;

  defaultOffset: number = 0;

  // View related members
  @ViewChild('galleryScroll') galleryScroll!: ElementRef;
  @ViewChild('galleryContainer') galleryContainer!: ElementRef;
  @ViewChildren('galleryContent') contentsQuery!: QueryList<ElementRef>;
  contentControlDisable: boolean = false;

  @ViewChild('modalContent') modalContent: ElementRef | undefined;

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
    const scrollElement = this.galleryScroll.nativeElement;
    const containerElement = this.galleryContainer.nativeElement;
    this.logger.debug(
      `[gallery] offset ${offset}, scroll window ${scrollElement.offsetWidth}, `,
      `container ${containerElement.offsetWidth}, current.scrollLeft ${scrollElement.scrollLeft}`,
    );
    scrollElement.scrollBy({
      left: containerElement.offsetWidth / 2 - scrollElement.offsetWidth / 2 + offset - scrollElement.scrollLeft,
      top: 0,
      behavior: behavior,
    });
  }

  onChangeIndex(delta: number) {
    if (this.contentControlDisable) return;
    this.currentId = (this.currentId + delta + this.contents.length) % this.contents.length;
    this.scrollContentToCenter(this.getContentSize() * this.currentId + this.getBaseContentOffset(), 'smooth');
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

  private getBaseContentOffset() {
    const contentSize = this.getContentSize();
    return -(((this.contents.length - 1) * contentSize) / 2);
  }

  getNumberOfContentsInScrollWindow() {
    const scrollElementSize = this.galleryScroll.nativeElement.offsetWidth;
    const contentSize = this.getContentSize();
    return Math.floor((scrollElementSize - contentSize) / (contentSize * 2)) * 2 + 1;
  }

  private async wait(ms: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
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

  onChangeOpenContentIndex(delta: number) {
    this.selectedGalleryId = (this.selectedGalleryId + delta + this.contents.length) % this.contents.length;
    this.selectedGallery = this.contents[this.selectedGalleryId];
  }

  onOpenContent(contentId: number) {
    const modalContentElement = this.modalContent?.nativeElement;
    this.selectedGalleryId = contentId;
    this.selectedGallery = this.contents[this.selectedGalleryId];
    this.addClasses(modalContentElement, ['animate']);
  }

  onCloseGalleryModal() {
    const modalContentElement = this.modalContent?.nativeElement;
    this.selectedGallery = undefined;
    this.selectedGalleryId = -1;
    this.removeClasses(modalContentElement, ['animate']);
  }

  reloadImage(error: any) {
    if (this.isBrowser()) {
      setTimeout(() => {
        const source = error.target.src;
        error.target.src = source;
      }, 1000);
    }
  }
}
