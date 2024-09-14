import { isPlatformBrowser } from '@angular/common';
import { Inject, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { signal } from '@angular/core';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LoggerService } from '../logger.service';

@Component({
  selector: 'app-class-on-view',
  standalone: true,
  imports: [],
  template: `
    <div #container>
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './class-on-view.component.css',
})
export class ClassOnViewComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() classOnView: string[] = [];
  @Input() classOffView: string[] = [];

  @ViewChild('container') container: ElementRef | undefined;

  isBrowser = signal(false);
  logger = inject(LoggerService);

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
                this.logger.debug(`[kamalshafi] off view ${this.classOffView} ${this.classOnView}`);
                child?.classList.add(...this.classOffView);
                child?.classList.remove(...this.classOnView);
              } else {
                this.logger.debug(`[kamalshafi] on view ${this.classOffView} ${this.classOnView}`);
                child?.classList.remove(...this.classOffView);
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
