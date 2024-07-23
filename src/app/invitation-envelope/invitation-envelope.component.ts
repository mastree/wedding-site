import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild, inject, signal } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoggerService } from '../logger.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-invitation-envelope',
  standalone: true,
  template: `
    <div class="bg-bg-envelope relative top-0 flex h-screen w-full flex-col">
      <div class="absolute top-0 w-full">
        <app-navigation-bar></app-navigation-bar>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-center gap-5" #envelope>
        <div class="relative">
          <div
            class="bg-envelope-paper paper absolute bottom-0 left-0 right-0 top-0 m-auto h-[11rem] w-[15rem] shadow-md"
          >
            <div
              class="relative flex size-full flex-col items-center justify-center gap-1 font-manuale text-[1.4rem] font-semibold text-primary"
            >
              <p>WEDDING</p>
              <p>INVITATION</p>
              <img
                class="absolute bottom-0 left-0 -z-10 h-[70%] translate-x-[-10%] translate-y-[10%]"
                src="letter-background.png"
              />
            </div>
          </div>

          <div class="flap absolute top-0">
            <div
              class="border-t-envelope-flap envelope-flap size-0 border-x-[9rem] border-t-[7.5rem] border-x-transparent drop-shadow-md"
            ></div>
          </div>
          <div class="h-[12rem] w-[18rem]">
            <div class="envelope-body fill-envelope-body absolute z-20 h-full w-full drop-shadow-md">
              <svg viewBox="0 0 288 192" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M269.489 0L144 99L18.511 0H0V192H288V0H269.489Z" />
              </svg>
            </div>
            <div
              class="envelope-body border-b-envelope-bottom absolute bottom-0 z-20 size-0 border-x-[9rem] border-b-[6rem] border-x-transparent bg-transparent"
            ></div>
            <div class="envelope-body bg-envelope-inner absolute top-0 z-0 h-full w-full"></div>
          </div>
        </div>
        <div class="flex flex-row items-center justify-center gap-4">
          <button
            (click)="onOpenEnvelope(true)"
            class="z-30 rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-sky-400 hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
          >
            OPEN
          </button>

          <button
            (click)="onOpenEnvelope(false)"
            class="z-30 rounded-lg bg-slate-100 p-2 font-manuale font-semibold text-primary ring-sky-400 hover:ring-2 active:bg-red-100 active:shadow-inner active:shadow-red-200 active:ring-2 md:p-3"
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
  styleUrl: './invitation-envelope.component.css',
  imports: [NavigationBarComponent, FooterComponent],
})
export class InvitationEnvelopeComponent {
  logger = inject(LoggerService);

  @ViewChild('envelope') envelopeElement!: ElementRef;
  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  onOpenEnvelope(doOpen: boolean) {
    this.logger.info(`onOpenEnvelope(${doOpen})`);
    if (doOpen) {
      this.envelopeElement.nativeElement.classList.toggle('close', false);
      this.envelopeElement.nativeElement.classList.toggle('open', true);
    } else {
      this.envelopeElement.nativeElement.classList.toggle('open', false);
      this.envelopeElement.nativeElement.classList.toggle('close', true);
    }
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
