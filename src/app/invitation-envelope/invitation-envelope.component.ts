import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoggerService } from '../logger.service';
import { isPlatformBrowser } from '@angular/common';
import { Invitation, WeddingService } from '../wedding.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invitation-envelope',
  standalone: true,
  template: `
    <div class="relative top-0 flex h-screen w-full flex-col bg-bg-envelope" #root>
      <div class="absolute top-0 w-full">
        <app-navigation-bar></app-navigation-bar>
      </div>
      <div class="flex h-full w-full flex-col items-center justify-start gap-5" #envelope>
        <div class="relative h-[20%] max-h-32"></div>
        <div class="relative mx-5 mb-10 flex max-w-md flex-col gap-5 font-manuale text-lg text-primary">
          <p>
            Hi <span class="font-semibold">{{ invitation?.name }}</span
            >,
          </p>
          <p>you received an invitation to Faiza & Kamal's wedding. Please find the details inside:</p>
        </div>
        <div class="relative">
          <div
            class="paper absolute bottom-0 left-0 right-0 top-0 m-auto h-[11rem] w-[15rem] bg-envelope-paper shadow-md"
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
              class="envelope-flap size-0 border-x-[9rem] border-t-[7.5rem] border-x-transparent border-t-envelope-flap drop-shadow-md"
            ></div>
          </div>
          <div class="h-[12rem] w-[18rem]">
            <div class="envelope-body absolute z-20 h-full w-full fill-envelope-body drop-shadow-md">
              <svg viewBox="0 0 288 192" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M269.489 0L144 99L18.511 0H0V192H288V0H269.489Z" />
              </svg>
            </div>
            <div
              class="envelope-body absolute bottom-0 z-20 size-0 border-x-[9rem] border-b-[6rem] border-x-transparent border-b-envelope-bottom bg-transparent"
            ></div>
            <div class="envelope-body absolute top-0 z-0 h-full w-full bg-envelope-inner"></div>
          </div>
        </div>
        <div class="mt-5 flex flex-row items-center justify-center gap-4">
          <button
            (click)="onOpenEnvelope(true)"
            class="z-30 rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-sky-400 hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
          >
            OPEN INVITATION
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
  weddingService = inject(WeddingService);

  invitation?: Invitation | undefined;
  loading = true;

  subscriptions: Subscription[] = [];

  @Output() envelopeEvent = new EventEmitter<boolean>();

  @ViewChild('envelope') envelopeElement!: ElementRef;
  @ViewChild('root') rootElement!: ElementRef;
  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  ngOnInit() {
    this.subscriptions.push(
      this.weddingService.invitation.subscribe((data) => {
        const nextLoading = data.status == 'loading';
        this.invitation = data.invitation;
        this.loading = nextLoading;
      }),
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onOpenEnvelope(doOpen: boolean) {
    this.logger.info(`onOpenEnvelope(${doOpen})`);
    if (doOpen) {
      this.envelopeElement.nativeElement.classList.toggle('close', false);
      this.envelopeElement.nativeElement.classList.toggle('open', true);
      this.rootElement.nativeElement.classList.toggle('animate-fade-out', true);
      setTimeout(() => {
        this.envelopeEvent.emit(true);
      }, 1600);
    } else {
      this.envelopeElement.nativeElement.classList.toggle('open', false);
      this.envelopeElement.nativeElement.classList.toggle('close', true);
      this.rootElement.nativeElement.classList.toggle('animate-fade-out', false);
      setTimeout(() => {
        this.envelopeEvent.emit(false);
      }, 400);
    }
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
