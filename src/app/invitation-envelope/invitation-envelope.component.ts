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
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Invitation, WeddingService } from '../wedding.service';
import { Subscription, map, of, skipWhile, take } from 'rxjs';
import { TypewriterService } from '../typewriter.service';

@Component({
  selector: 'app-invitation-envelope',
  standalone: true,
  template: `
    <div class="relative h-full w-full bg-bg-envelope">
      <div class="absolute top-0 w-full">
        <app-navigation-bar></app-navigation-bar>
      </div>
      <div class="relative top-0 flex min-h-screen w-full flex-col items-center justify-center" #root>
        <div class="my-[max(10vh,4rem)] flex w-full max-w-screen-lg flex-col items-center justify-start gap-5">
          <div class="relative mx-10 flex max-w-md flex-col gap-5 font-manuale text-lg text-primary">
            <p>
              {{ textHeaderGreetings$ | async }}<span class="font-semibold">{{ textHeaderName$ | async }}</span
              >,
            </p>
            <div class="relative flex flex-col">
              <p class="absolute">{{ textContent$ | async }}</p>
              <p class="pointer-events-none opacity-0">{{ kTextContent }}</p>
            </div>
          </div>
          <div class="my-5 flex h-full w-full flex-col items-center justify-start gap-5 opacity-0" #envelope>
            <div class="relative" (click)="onOpenEnvelope(true)">
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
                class="rounded-lg bg-primary p-2 font-manuale font-semibold text-white ring-sky-400 hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2"
              >
                OPEN INVITATION
              </button>
            </div>
          </div>
        </div>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './invitation-envelope.component.css',
  imports: [NavigationBarComponent, FooterComponent, CommonModule],
})
export class InvitationEnvelopeComponent {
  kTextHeader = 'Hi ';
  kTextContent = "You received an invitation to Faiza & Kamal's wedding ceremony. Please find the details inside:";

  logger = inject(LoggerService);
  weddingService = inject(WeddingService);
  typewritterService = inject(TypewriterService);

  invitation?: Invitation | undefined;
  loading = true;

  textHeader$ = this.typewritterService.getTypedText(this.kTextHeader);
  textHeaderGreetings$ = this.textHeader$.pipe(take(4));
  textHeaderName$ = of(',');
  textContent$ = of('');

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
        if (this.invitation) {
          this.kTextHeader = `Hi ${this.invitation.name}`;
          this.textHeader$ = this.typewritterService.getTypedText(this.kTextHeader);
          this.textHeaderGreetings$ = this.textHeader$.pipe(take(4));
          this.textHeaderName$ = this.textHeader$.pipe(
            skipWhile((x) => x.length <= 3),
            map((x) => x.substring(3, x.length)),
          );
          this.textHeader$.subscribe({
            complete: () => {
              setTimeout(() => {
                this.textContent$ = this.typewritterService.getTypedText(this.kTextContent, 20);
                this.textContent$.subscribe({
                  complete: () => {
                    this.envelopeElement.nativeElement.classList.toggle('animate-scale-in', true);
                  },
                });
              }, 100);
            },
          });
        }
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
      }, 2300);
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
