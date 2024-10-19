import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, ChangeDetectorRef } from '@angular/core';
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
  @Input() defaultClass: string[] = [];
  @Input() oneShot: boolean = false;

  @ViewChild('container') container: ElementRef | undefined;

  isBrowser = signal(false);
  logger = inject(LoggerService);
  onViewObserver: IntersectionObserver | undefined = undefined;

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
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

  ngAfterViewInit() {
    if (this.isBrowser()) {
      this.addClasses(this.container?.nativeElement.firstChild, this.defaultClass);
      if (this.classOnView.length > 0) {
        const threshold = [0, 0.1];
        this.onViewObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              // WAR to handle weird intersection logic when animation active.
              // - Observe the container for its child animation activation.
              const child = entry.target.firstElementChild;
              if (entry.intersectionRatio <= 0) {
                this.logger.debug(`[kamalshafi] off view ${this.classOffView} ${this.classOnView}`);
                child?.classList.add(...this.classOffView);
                child?.classList.remove(...this.classOnView);
                this.changeDetectorRef.detectChanges();
              } else {
                this.logger.debug(`[kamalshafi] on view ${this.classOffView} ${this.classOnView}`);
                child?.classList.remove(...this.classOffView);
                child?.classList.add(...this.classOnView);
                this.changeDetectorRef.detectChanges();
                if (this.oneShot) this.disconnectOnViewObserver();
              }
            });
          },
          { threshold },
        );
        this.onViewObserver.observe(this.container?.nativeElement);
      }
    }
  }

  disconnectOnViewObserver() {
    this.onViewObserver?.disconnect();
  }
}
