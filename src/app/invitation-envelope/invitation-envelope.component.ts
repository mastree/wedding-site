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
    <div class="relative flex h-full min-h-screen w-full flex-col justify-between">
      <div class="absolute top-0 -z-10 h-full w-screen">
        <div class="h-full w-full bg-gradient-to-b from-bg-envelope to-bg-envelope-bottom opacity-80"></div>
        <img
          src="prewed/IMG_0151.jpg"
          class="absolute top-0 -z-10 h-full w-screen object-cover object-cover-image"
          loading="eager"
          fetchpriority="high"
          (error)="reloadImage($event)"
        />
      </div>
      <div class="relative top-0 flex w-full flex-grow flex-col items-center justify-start" #root>
        <div
          class="mx-[max(10vw,2rem)] my-[max(10vh,4rem)] flex w-full max-w-screen-lg flex-col items-start justify-start gap-5"
        >
          <div
            class="relative mx-10 flex max-w-md flex-col gap-5 font-manuale text-base text-primary md:text-lg lg:text-xl"
          >
            <p>
              {{ textHeaderGreetings$ | async }}<span class="font-semibold">{{ textHeaderName$ | async }}</span
              >,
            </p>
            <div class="relative flex flex-col">
              <p class="absolute">{{ textContent$ | async }}</p>
              <p class="pointer-events-none opacity-0">{{ kTextContent }}</p>
            </div>

            <div class="mt-5 flex w-full flex-row items-center justify-center gap-2 text-sm md:text-base" #envelope>
              <button
                (click)="onOpenEnvelope(true)"
                class="animate-delay-400 animate-scale-in active:ring-3 flex-grow select-none rounded-lg bg-primary p-2 font-manuale font-semibold text-white opacity-0 shadow-md shadow-gray-400 hover:ring-2 hover:ring-white active:bg-white active:text-primary active:shadow-inner active:shadow-slate-100 active:ring-light-primary"
              >
                OPEN INVITATION
              </button>
              <button
                (click)="onDownloadAsPdf()"
                class="animate-delay-500 animate-scale-in active:ring-3 flex-grow select-none rounded-lg bg-white p-2 font-manuale font-semibold text-primary opacity-0 shadow-md hover:ring-2 hover:ring-light-primary active:bg-primary active:text-white active:shadow-inner active:shadow-light-primary active:ring-white"
              >
                DOWNLOAD PDF
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
                    this.envelopeElement.nativeElement.classList.toggle('animate', true);
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
      this.rootElement.nativeElement.classList.toggle('animate-fade-out-fast', true);
      setTimeout(() => {
        this.envelopeEvent.emit(true);
      }, 600);
    } else {
      this.envelopeElement.nativeElement.classList.toggle('open', false);
      this.envelopeElement.nativeElement.classList.toggle('close', true);
      this.rootElement.nativeElement.classList.toggle('animate-fade-out', false);
      setTimeout(() => {
        this.envelopeEvent.emit(false);
      }, 400);
    }
  }

  onDownloadAsPdf() {
    this.logger.info(`Downloading invitation for ${JSON.stringify(this.invitation)}...`);
    this.weddingService.downloadInvitationPdf(this.invitation!.name).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        // To open in new window
        // window.open(fileURL);
        const dummy = document.createElement('a') as HTMLAnchorElement;
        dummy.href = fileURL;
        dummy.target = '_blank';
        dummy.download = 'invitation.pdf';
        document.body.appendChild(dummy);
        dummy.click();
        document.body.removeChild(dummy);
      },
      error: (err) => {
        this.logger.error(`Failed to download invitation ${JSON.stringify(this.invitation)}`);
        if (this.isBrowser()) {
          window.alert('Failed to download.');
        }
      },
    });
  }

  reloadImage(error: any) {
    if (this.isBrowser()) {
      setTimeout(() => {
        const source = error.target.src;
        error.target.src = source;
      }, 1000);
    }
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }
}
