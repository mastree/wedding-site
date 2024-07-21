import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoggerService } from '../logger.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-invitation-letter',
  standalone: true,
  template: `
    <div class="bg-bg-letter relative top-0 flex h-screen w-full flex-col bg-opacity-30">
      <div class="absolute top-0 w-full">
        <app-navigation-bar></app-navigation-bar>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-center gap-5">
        <div class="relative">
          <div
            class="border-t-letter-flap flap close absolute top-0 h-0 w-0 border-l-[9rem] border-r-[9rem] border-t-[7.5rem] border-l-transparent border-r-transparent"
            #flap
          ></div>
          <div class="fill-letter-body h-[12rem] w-[18rem]">
            <svg viewBox="0 0 288 192" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M269.489 0L144 99L18.511 0H0V192H288V0H269.489Z" />
            </svg>
          </div>
        </div>
        <div class="flex flex-row items-center justify-center gap-4">
          <button
            (click)="onOpenLetter(true)"
            class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-sky-400 hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
          >
            OPEN
          </button>

          <button
            (click)="onOpenLetter(false)"
            class="rounded-lg bg-slate-100 p-2 font-manuale font-semibold text-primary ring-sky-400 hover:ring-2 active:bg-red-100 active:shadow-inner active:shadow-red-200 active:ring-2 md:p-3"
          >
            CLOSE
          </button>
        </div>
      </div>
      <div class="absolute bottom-0 w-full">
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styleUrl: './invitation-letter.component.css',
  imports: [NavigationBarComponent, FooterComponent],
})
export class InvitationLetterComponent {
  logger = inject(LoggerService);

  @ViewChild('flap') flapElement!: ElementRef;
  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  onOpenLetter(doOpen: boolean) {
    this.logger.info(`onOpenLetter(${doOpen})`);
    if (doOpen) {
      this.flapElement.nativeElement.classList.toggle('open', true);
      // this.flapElement.nativeElement.classList.toggle('close', false);
    } else {
      this.flapElement.nativeElement.classList.toggle('open', false);
      // this.flapElement.nativeElement.classList.toggle('close', true);
    }
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
