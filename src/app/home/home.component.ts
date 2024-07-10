import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { CardComponent } from '../card/card.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { Invitation, WeddingService } from '../wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../logger.service';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    @if (loading) {
      <div class="relative top-0 h-screen w-full bg-white bg-opacity-30 md:min-h-[31.5rem]">
        <div class="absolute bottom-0 top-0 z-10 h-full w-full">
          <app-navigation-bar></app-navigation-bar>
        </div>
        <div class="flex size-8 h-full w-full items-center justify-center">
          <div class="flex flex-col items-center justify-center">
            <div class="mb-5 size-8 fill-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
                >
                  <animateTransform
                    attributeName="transform"
                    dur="0.5s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </path>
              </svg>
            </div>
            <p class="text=md font-manuale text-primary">Fetching invitation...</p>
            <p class="text=md font-manuale text-primary">Please wait</p>
          </div>
        </div>
      </div>
    } @else {
      <header class="relative top-0 h-[66vh] min-h-[25rem] w-full bg-white bg-opacity-30 md:min-h-[31.5rem]">
        <div class="absolute bottom-0 top-0 z-10 h-full w-full">
          <app-navigation-bar></app-navigation-bar>
        </div>
        <div class="absolute left-0 top-0 -z-10 h-full w-full overflow-y-hidden object-cover">
          <video
            class="pointer-events-none absolute h-full w-full object-cover object-left-top"
            onloadedmetadata="this.muted=true"
            playsinline
            autoplay
            muted
            loop
          >
            <source src="invitation-bg-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div class="relative mx-auto h-full max-w-screen-lg">
          <div class="flex h-full w-full flex-col items-center justify-center gap-5 pt-5">
            <div class="flex w-full flex-col items-center justify-center text-primary">
              <p class="justify-center font-manuale text-[1.6875rem] font-bold md:text-[1.9rem]">
                {{ getFirstSectionText[0] }}
              </p>
              <p class="justify-center font-manuale text-[1.6875rem] font-bold md:text-[1.9rem]">
                {{ getFirstSectionText[1] }}
              </p>
            </div>
            <div class="flex w-full flex-col items-center justify-center" #bigDay>
              <div
                class="animate-scale-in animate-fast mx-8 flex h-[5rem] w-[18rem] max-w-[90vw] items-center justify-center rounded-md bg-primary shadow-lg md:h-[6.5rem]"
              >
                <p class="font-manuale text-[1.5rem] font-semibold text-white md:text-[2rem]">
                  {{ getFirstSectionText[2] }}
                </p>
              </div>
            </div>
            <app-countdown [eventDate]="eventDate"></app-countdown>
          </div>
        </div>
        <div
          class="absolute bottom-0 right-0 z-[-2] mt-16 font-manuale text-xs text-slate-400 [writing-mode:vertical-lr] md:text-sm"
        >
          <a href="https://www.vecteezy.com/free-videos/invitation">
            <p>Invitation Stock Videos by Vecteezy</p>
          </a>
        </div>
      </header>

      <section class="relative h-[34vh] min-h-[12.5rem] bg-secondary md:min-h-[20rem]">
        <div class="relative mx-auto h-full max-w-screen-lg">
          <div class="absolute top-0 flex w-full translate-y-[-100%] flex-col items-center justify-end">
            <p class="font-manuale text-[1.6rem] font-semibold text-primary">LEFT</p>
          </div>
          <div class="absolute top-0 flex w-full flex-col items-center justify-end">
            <p class="font-manuale text-[1.6rem] font-semibold text-primary">UNTIL</p>
          </div>
          <div class="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
            <div>
              <p class="justify-center font-marcellus-sc text-[2rem] text-white md:text-[2.4rem]">Kamal & Faiza's</p>
              <p class="justify-center font-marcellus-sc text-[2rem] text-white md:text-[2.4rem]">Wedding</p>
            </div>
            <div
              (click)="onDownloadAsPdf()"
              class="active-go-up flex gap-2 font-lato font-light text-white"
              [ngClass]="invitation ? '' : ['hidden']"
            >
              <img src="download.svg" />
              <p class="line-2 text-sm active:text-sky-700 md:text-[1rem]">Download invitation as PDF</p>
            </div>
          </div>
          <div class="absolute bottom-0 mb-1 flex w-full items-center justify-center gap-0">
            <div class="size-8 rounded-[50%]">
              <svg class="animate-bounce-small" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="#CCCCCC"
                  stroke-width="0.048"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    class="stroke-dark-item"
                    d="M12 6L12 18M12 18L17 13M12 18L7 13"
                    stroke="#FFFFFF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
            </div>
            <p class="text-center font-lato text-sm font-light text-dark-item">or scroll for details</p>
          </div>
        </div>
      </section>

      <section class="relative flex flex-col gap-8 bg-white bg-opacity-30 pb-20 pt-16">
        <div class="absolute right-0 top-0 -z-20 h-full w-full overflow-y-hidden object-cover">
          <video
            class="pointer-events-none absolute h-full w-full object-cover object-right-top"
            onloadedmetadata="this.muted=true"
            playsinline
            autoplay
            muted
            loop
          >
            <source src="invitation-bg-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
        <div class="relative mx-auto h-full w-full max-w-screen-lg">
          <div class="mb-5 flex w-full flex-col justify-center">
            <p class="text-center font-manuale text-xl font-semibold md:text-2xl">SCHEDULE & LOCATION</p>
            <p class="text-md text-center font-manuale font-light">Jadwal & Tempat</p>
          </div>
          <div class="flex w-full flex-grow flex-col items-center justify-start gap-8 overflow-clip">
            <app-card [classOnView]="animateGoFromLeft" icon="calendar.svg" title="Schedule">
              <p class="font-manuale text-[1rem] md:text-[1.25rem]">
                <span class="font-semibold">Date:</span> Sunday, 15 Dec 2024
              </p>
              <p class="font-manuale text-[1rem] md:text-[1.25rem]">
                <span class="font-semibold">Time:</span> 10.00 &mdash; 14.00 WIB
              </p>
            </app-card>
            <app-card [classOnView]="animateGoFromRight" icon="location-pin.svg" title="Location">
              <p class="font-manuale text-[1rem] font-semibold md:text-[1.25rem]">Maxi's Resto</p>
              <p class="font-manuale text-[1rem] md:text-[1.25rem]">Jl. Gunung Agung No.8, Ciumbuleuit, Kota Bandung</p>
              <a
                class="mt-2 flex flex-row items-center gap-1 fill-sky-400 text-sky-400 active:fill-sky-700 active:text-sky-700"
                href="https://maps.app.goo.gl/9kLNCJA7acvwyxJB8"
                target="_blank"
              >
                <p class="font-manuale text-[1rem] active:underline">Open in GMaps</p>
                <span class="size-3">
                  <svg viewBox="0 0 33 33" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M32 0H23C22.4477 0 22 0.447716 22 1C22 1.55228 22.4477 2 23 2H29.5858L15.2929 16.2929L16.7071 17.7071L31 3.41421V10C31 10.5523 31.4477 11 32 11C32.5523 11 33 10.5523 33 10V1C33 0.447716 32.5523 0 32 0ZM7 3H16V1H7C3.13401 1 0 4.13401 0 8V26C0 29.866 3.13401 33 7 33H25C28.866 33 32 29.866 32 26V17H30V26C30 28.7614 27.7614 31 25 31H7C4.23858 31 2 28.7614 2 26V8C2 5.23858 4.23858 3 7 3Z"
                    />
                  </svg>
                </span>
              </a>
            </app-card>
          </div>
        </div>
      </section>

      <section class="bg-secondary">
        <div class="relative mx-auto h-full w-full max-w-screen-lg">
          <app-rsvp></app-rsvp>
        </div>
      </section>

      <footer class="w-full bg-dark-secondary p-3">
        <p class="text-center font-manuale text-[0.7rem] text-white">
          <span class="font-semibold">Copyright</span> ©{{ currentYear }}
          <a href="https://kamalshafi.me"><span class="font-semibold underline active:text-sky-700">kamalshafi</span></a
          >, All Rights Reserved
        </p>
      </footer>
    }
  `,
  styleUrl: './home.component.css',
  imports: [NavigationBarComponent, CountdownComponent, CardComponent, RsvpComponent, NgClass],
})
export class HomeComponent implements OnInit, OnDestroy {
  private kFirstSectionText = {
    0: ['WELCOME', 'TO THE', 'Announcement!'],
    1: ["YOU'RE", 'INVITED', 'TO THE BIG DAY!'],
  };

  // Model related members
  logger = inject(LoggerService);
  route = inject(ActivatedRoute);
  weddingService = inject(WeddingService);
  invitation?: Invitation | undefined;
  loading = true;

  subscriptions: Subscription[] = [];

  // View related members
  @ViewChild('bigDay') bigDayElement: ElementRef | undefined;

  eventDate: Date = new Date('2024-12-15T10:00:00.000+07:00');

  animateGoFromLeft = ['animate-go-from-left'];
  animateGoFromRight = ['animate-go-from-right'];
  isBrowser = signal(false);

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private router: Router,
  ) {
    this.isBrowser.set(isPlatformBrowser(platformId)); // save isPlatformBrowser in signal
  }

  ngOnInit() {
    const housingLocationId = this.route.snapshot.params['id'];
    this.weddingService.getInvitation(housingLocationId);
    this.subscriptions.push(
      this.weddingService.invitation.subscribe((data) => {
        const nextLoading = data.status == 'loading';
        this.invitation = data.invitation;
        if (this.isBrowser() && this.loading && !nextLoading) {
          setTimeout(async () => {
            const videos = document.querySelectorAll('video[muted][autoplay]') as NodeListOf<HTMLVideoElement>;
            videos.forEach(async (video) => {
              try {
                await video.play();
              } catch (err) {
                this.logger.error(`can't play background video: ${err}`);
              }
            });
          }, 1000);
        }
        this.loading = nextLoading;
        if (this.isBrowser()) {
          if (!this.invitation && !this.loading) {
            this.router.navigate(['announcement']);
          }
        }
      }),
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  ngAfterViewInit() {
    if (this.isBrowser()) {
      window.addEventListener('load', async () => {
        const videos = document.querySelectorAll('video[muted][autoplay]') as NodeListOf<HTMLVideoElement>;
        videos.forEach(async (video) => {
          try {
            await video.play();
          } catch (err) {
            this.logger.error(`can't play background video: ${err}`);
          }
        });
      });
      const threshold = [0, 0.1];
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // WAR to handle weird intersection logic when animation active.
            // - Observe the container for its child animation activation.
            const child = entry.target.firstElementChild;
            if (entry.intersectionRatio <= 0) {
              child?.classList.add('opacity-0');
              child?.classList.remove('animate');
            } else {
              child?.classList.remove('opacity-0');
              child?.classList.add('animate');
            }
          });
        },
        { threshold },
      );
      observer.observe(this.bigDayElement!.nativeElement);
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

  get getFirstSectionText() {
    if (this.invitation) {
      return this.kFirstSectionText[1];
    }
    return this.kFirstSectionText[0];
  }
}
