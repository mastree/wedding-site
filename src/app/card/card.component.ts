import { isPlatformBrowser } from '@angular/common';
import { Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { signal } from '@angular/core';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
    <div class="flex min-h-40 w-[90%] items-center rounded-lg bg-slate-50 px-3 pb-7 pt-3 shadow-lg" #container>
      <div class="flex h-full w-full flex-col items-center justify-center gap-2">
        <div class="flex grow items-center justify-center">
          <p class="font-manuale text-xl font-semibold lg:text-2xl">{{ title }}</p>
        </div>
        <div class="flex h-full w-full flex-row items-center">
          <div class="flex h-full min-w-[25%] max-w-[35%] flex-col items-center justify-center">
            <img class="max-h-32 max-w-[4.5rem]" [src]="icon" />
          </div>
          <div class="w-full grow-[2] pl-3">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() classOnView: string[] = [];

  @ViewChild('container') container: ElementRef | undefined;

  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      if (this.classOnView.length > 0) {
        const threshold = [0, 0.1];
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // WAR to handle weird intersection logic when animation active.
              // - Observe the container for its child animation activation.
              const child = entry.target.firstElementChild;
              if (entry.intersectionRatio <= 0) {
                child?.classList.add('opacity-0');
                child?.classList.remove(...this.classOnView);
              } else {
                child?.classList.remove('opacity-0');
                child?.classList.add(...this.classOnView);
              }
            });
          },
          { threshold },
        );
        observer.observe(this.container?.nativeElement);
      }
    }
  }
}
