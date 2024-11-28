import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationBarComponent } from '../navigation-bar/navigation-bar.component';
import { CountdownComponent } from '../countdown/countdown.component';
import { CardComponent } from '../card/card.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { Invitation, WeddingService } from '../wedding.service';
import { LoggerService } from '../logger.service';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { HomeLoadingComponent } from '../home-loading/home-loading.component';
import { FooterComponent } from '../footer/footer.component';
import { ClassOnViewComponent } from '../class-on-view/class-on-view.component';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-main-invitation',
  standalone: true,
  template: `
    <div
      class="delay-50 scale-0 scale-100 opacity-0 opacity-100 transition-all delay-100 delay-1000 duration-700"
      #dummyClass
    ></div>
    <div class="animate-fade-in h-full w-full">
      <div class="relative flex h-screen min-h-[37.5rem] w-full flex-col gap-0 lg:min-h-[45rem]">
        <header class="relative top-0 h-[66%] w-full bg-white bg-opacity-30">
          <div class="absolute bottom-0 top-0 z-20 h-full w-full">
            <app-navigation-bar></app-navigation-bar>
          </div>
          <div class="absolute left-0 top-0 -z-10 h-full w-full overflow-y-hidden object-cover">
            <video
              class="pointer-events-none absolute h-full w-full object-cover object-left-top"
              poster="invitation-bg-video.png"
              onloadedmetadata="this.muted=true"
              playsinline
              autoplay
              muted
              loop
            >
              <source src="invitation-bg-video.mp4?ngsw-bypass=true" type="video/mp4" />
              <img
                src="invitation-bg-video.png"
                title="Your browser does not support the <video> tag"
                loading="eager"
                fetchpriority="high"
              />
            </video>
          </div>
          <div class="relative mx-auto h-full max-w-screen-lg">
            <div class="flex h-full w-full flex-col items-center justify-center gap-5 pt-5">
              <div class="flex w-full flex-col items-center justify-center text-primary">
                <p class="justify-center font-manuale text-[1.6875rem] font-bold lg:text-[1.9rem]">
                  {{ getFirstSectionText[0] }}
                </p>
                <p class="justify-center font-manuale text-[1.6875rem] font-bold lg:text-[1.9rem]">
                  {{ getFirstSectionText[1] }}
                </p>
              </div>
              <app-class-on-view
                [defaultClass]="kDefaultClass"
                [classOnView]="kClassOnView"
                [classOffView]="kClassOffView"
                [oneShot]="true"
              >
                <div class="flex w-full scale-0 flex-col items-center justify-center opacity-0">
                  <div
                    class="mx-8 flex h-[5rem] w-[18rem] max-w-[90vw] items-center justify-center rounded-md bg-primary shadow-lg lg:h-[6.5rem]"
                  >
                    <p class="font-manuale text-[1.5rem] font-semibold text-white lg:text-[2rem]">
                      {{ getFirstSectionText[2] }}
                    </p>
                  </div>
                </div>
              </app-class-on-view>
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

        <section class="relative h-[34%] bg-secondary">
          <div class="relative mx-auto h-full max-w-screen-lg">
            <div class="absolute top-0 flex w-full translate-y-[-100%] flex-col items-center justify-end">
              <p class="font-manuale text-[1.6rem] font-semibold text-primary">LEFT</p>
            </div>
            <div class="absolute top-0 flex w-full flex-col items-center justify-end">
              <p class="font-manuale text-[1.6rem] font-semibold text-primary">UNTIL</p>
            </div>
            <div class="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
              <div>
                <p class="justify-center font-marcellus-sc text-[2rem] text-white lg:text-[2.4rem]">Kamal & Faiza's</p>
                <p class="justify-center font-marcellus-sc text-[2rem] text-white lg:text-[2.4rem]">Wedding</p>
              </div>
              <div
                (click)="onDownloadAsPdf()"
                class="active-go-up relative flex select-none gap-2 rounded-lg p-1 font-lato font-light text-white ring-white hover:cursor-pointer hover:ring-2 active:text-slate-300"
                [ngClass]="invitation ? '' : ['hidden']"
              >
                <img src="download.svg" loading="eager" fetchpriority="high" (error)="reloadImage($event)" />
                <p class="line-2 text-sm lg:text-[1rem]">Download invitation as PDF</p>
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
      </div>

      <section class="relative z-10 flex flex-col items-center justify-center gap-8 bg-bg-main pb-12 pt-16">
        <div class="relative my-10 flex h-full w-full max-w-screen-lg flex-row items-center justify-center">
          <div class="flex w-full flex-col items-center justify-center gap-16">
            <app-class-on-view
              [defaultClass]="kDefaultClass"
              [classOnView]="kClassOnView"
              [classOffView]="kClassOffView"
              [oneShot]="true"
            >
              <div
                class="relative mb-10 flex h-[14rem] w-[12rem] scale-0 flex-col items-center justify-center rounded-lg bg-illustration-bg opacity-0 shadow-lg shadow-gray-400 ring-[3px] ring-white lg:h-[17.5rem] lg:w-[15rem]"
              >
                <img
                  src="illustration-no-bg.png"
                  class="h-full overflow-hidden rounded-lg object-cover"
                  loading="eager"
                  fetchpriority="high"
                  (error)="reloadImage($event)"
                />
                <img
                  src="flower-deco-angle.png"
                  class="absolute left-0 top-0 w-[60%] translate-x-[-20%] translate-y-[-30%]"
                  loading="eager"
                  fetchpriority="high"
                  (error)="reloadImage($event)"
                />
                <img
                  src="flower-deco-angle.png"
                  class="absolute bottom-0 right-0 w-[60%] translate-x-[20%] translate-y-[30%] scale-[-100%]"
                  loading="eager"
                  fetchpriority="high"
                  (error)="reloadImage($event)"
                />
              </div>
            </app-class-on-view>
            <app-class-on-view
              [defaultClass]="kDefaultClass"
              [classOnView]="kClassOnView"
              [classOffView]="kClassOffView"
              [oneShot]="true"
            >
              <div class="mx-5 flex scale-0 flex-col items-center justify-center gap-2 text-center opacity-0">
                <p class="font-manuale text-xl font-bold text-primary lg:text-2xl">Faiza Nurkholida</p>
                <p class="font-manuale text-base text-primary lg:text-[1.2rem]">
                  Putri Bapak (Alm) Muh Khozin dan Ibu Isrofah Wijayanti
                </p>
              </div>
            </app-class-on-view>
            <app-class-on-view
              [defaultClass]="kDefaultClass"
              [classOnView]="kClassOnView"
              [classOffView]="kClassOffView"
              [oneShot]="true"
            >
              <div
                class="mx-5 flex size-[3rem] scale-0 flex-col items-center justify-center rounded-full bg-primary opacity-0 lg:size-[4rem]"
              >
                <p
                  class="-translate-y-[0.2rem] text-center font-manuale text-[2rem] font-bold text-white lg:text-[2.6rem]"
                >
                  &
                </p>
              </div>
            </app-class-on-view>
            <app-class-on-view
              [defaultClass]="kDefaultClass"
              [classOnView]="kClassOnView"
              [classOffView]="kClassOffView"
              [oneShot]="true"
            >
              <div class="mx-5 flex scale-0 flex-col items-center justify-center gap-2 text-center opacity-0">
                <p class="font-manuale text-xl font-bold text-primary lg:text-2xl">Muhammad Kamal Shafi</p>
                <p class="font-manuale text-base text-primary lg:text-[1.2rem]">
                  Putra Bapak Shafiyuddin dan Ibu Rahmi Syahrini
                </p>
              </div>
            </app-class-on-view>
          </div>
        </div>
        <div class="absolute bottom-0 left-0 flex w-full translate-y-[50%] justify-center">
          <img
            src="flower-deco-line.png"
            class="w-[80%] max-w-[25rem] object-fill"
            loading="eager"
            fetchpriority="high"
            (error)="reloadImage($event)"
          />
        </div>
      </section>

      <section class="relative flex flex-col items-center justify-center gap-8 bg-bg-main-shaded py-8">
        <div
          class="relative mb-5 mt-12 flex h-full w-full max-w-screen-2xl flex-col items-center justify-center gap-10"
        >
          <app-gallery class="w-full"></app-gallery>
        </div>
      </section>

      <section class="relative flex flex-col items-center justify-center bg-bg-main pb-20 pt-14">
        <div class="relative flex w-full max-w-screen-lg flex-col items-center justify-center gap-8">
          <app-class-on-view
            [defaultClass]="kDefaultClass"
            [classOnView]="kClassOnView"
            [classOffView]="kClassOffView"
            [oneShot]="true"
          >
            <div class="flex w-full scale-0 flex-col justify-center opacity-0">
              <p class="text-center font-manuale text-xl font-semibold lg:text-2xl">RESEPSI</p>
              <p class="text-center font-manuale text-base font-light">Schedule & Location</p>
            </div>
          </app-class-on-view>
          <app-class-on-view
            class="flex w-full max-w-screen-md flex-row px-[min(5rem,10vw)]"
            [defaultClass]="kDefaultClass"
            [classOnView]="kClassOnView"
            [classOffView]="kClassOffView"
            [oneShot]="true"
          >
            <div class="flex w-full max-w-screen-md scale-0 flex-row gap-8 opacity-0" #schedule>
              <img
                class="max-h-32 max-w-[4.5rem]"
                src="calendar.svg"
                loading="eager"
                fetchpriority="high"
                (error)="reloadImage($event)"
              />
              <div class="flex flex-col items-start">
                <p class="text-center font-manuale text-sm font-light lg:text-lg">Sunday,</p>
                <p class="text-center font-manuale text-2xl font-light lg:text-4xl">15</p>
                <p class="text-center font-manuale text-sm font-light lg:text-lg">Desember 2024</p>
                <p class="text-center font-manuale text-sm font-light lg:text-lg">14:30 — 18:00 WIB</p>
              </div>
            </div>
          </app-class-on-view>
          <app-class-on-view
            [defaultClass]="kDefaultClass"
            [classOnView]="kClassOnView"
            [classOffView]="kClassOffView"
            [oneShot]="true"
          >
            <div
              class="flex w-full max-w-screen-md scale-0 flex-row gap-8 px-[min(6rem,10vw+1rem)] opacity-0"
              #location
            >
              <div class="flex flex-col items-start border-t-[0.5px] border-t-gray-500 pt-8">
                <div class="flex flex-row items-center justify-start gap-2">
                  <img
                    class="max-h-[1rem] max-w-[1rem]"
                    src="location-pin.svg"
                    loading="eager"
                    fetchpriority="high"
                    (error)="reloadImage($event)"
                  />
                  <p class="text-center font-manuale text-2xl font-light lg:text-4xl">Maxi's Resto</p>
                </div>
                <p class="text-left font-manuale text-sm font-light lg:text-lg">
                  Jl. Gunung Agung No.8, Ciumbuleuit, Kec. Cidadap, Kota Bandung, Jawa Barat 40143, Indonesia
                </p>
                <a
                  class="mt-2 flex flex-row items-center gap-1 fill-sky-400 text-sky-400 active:fill-sky-700 active:text-sky-700"
                  href="https://maps.app.goo.gl/9kLNCJA7acvwyxJB8"
                  target="_blank"
                >
                  <p class="font-manuale text-sm hover:underline active:font-bold lg:text-lg">Open in GMaps</p>
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
              </div>
            </div>
          </app-class-on-view>

          <app-class-on-view
            class="mt-5 flex w-full items-center justify-center"
            [defaultClass]="kDefaultClass"
            [classOnView]="kClassOnView"
            [classOffView]="kClassOffView"
            [oneShot]="true"
          >
            <div
              class="mx-[min(5rem,10vw)] flex max-w-screen-sm scale-0 flex-row justify-center rounded-xl bg-secondary p-4 opacity-0"
            >
              <p class="font-marcellus-sc text-sm text-white md:text-base lg:text-lg">
                Akad Nikah is scheduled to be held ahead of time on December 8, 2024, at the bride's family's residence.
              </p>
            </div>
          </app-class-on-view>
        </div>
      </section>

      <section class="bg-secondary">
        <div class="relative mx-auto h-full w-full max-w-screen-lg">
          <app-rsvp></app-rsvp>
        </div>
      </section>

      <app-footer></app-footer>
    </div>

    <audio controls autoplay loop class="hidden" #music>
      <source src="fly-me-to-the-moon-v2.mp3" type="audio/mpeg" />
      Your browser doesn't support this audio format.
    </audio>

    <div
      class="music-container fixed bottom-5 right-5 flex size-10 items-center justify-center rounded-full bg-slate-400 md:size-12"
      (click)="toggleMusicPlay()"
      #musicPlayer
    >
      <div class="absolute size-[100%] rounded-full bg-white"></div>
      <div class="absolute flex size-[80%] items-center justify-center rounded-full bg-primary">
        <svg
          class="animate animate-custom-spin relative h-[60%]"
          [ngClass]="isMusicPlaying ? '' : 'paused'"
          viewBox="0 0 14 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.18896 0.905273L9.25036 0.912476L9.24963 0.91687C11.9756 1.45178 13.7236 4.07715 13.275 6.73474C12.908 5.71838 11.4802 4.6864 9.61303 4.19861C9.31603 4.12097 9.02197 4.06091 8.73425 4.01746L7.0874 13.9257C7.08789 13.9946 7.08386 14.064 7.07519 14.1334C6.91735 15.3945 5.26953 16.2267 3.39465 15.9921C1.51965 15.7573 0.127802 14.5448 0.285639 13.2837C0.443476 12.0226 2.0913 11.1904 3.96618 11.4252C4.61132 11.5059 5.19946 11.7025 5.68676 11.9769L7.07495 0.658203L8.2091 0.790771L8.21252 0.777588L8.86816 0.856567C8.97656 0.869629 9.08337 0.885864 9.18896 0.905273Z"
            fill="white"
          />
        </svg>
      </div>
      <div
        class="animate-custom-ping animate absolute -z-10 size-[100%] rounded-full bg-dark-secondary shadow-dark-secondary/50"
      ></div>
    </div>
  `,
  styleUrl: './main-invitation.component.css',
  imports: [
    NavigationBarComponent,
    CountdownComponent,
    CardComponent,
    RsvpComponent,
    NgClass,
    HomeLoadingComponent,
    FooterComponent,
    ClassOnViewComponent,
    GalleryComponent,
  ],
})
export class MainInvitationComponent implements OnInit, OnDestroy {
  private kFirstSectionText = {
    0: ['WELCOME', 'TO THE', 'Announcement!'],
    1: ["YOU'RE", 'INVITED', 'TO THE BIG DAY!'],
  };

  kClassOnView = ['scale-100', 'opacity-100', 'delay-100'];
  kClassOffView = ['scale-0', 'opacity-0', 'delay-1000'];
  kDefaultClass = ['transition-all', 'duration-700', 'delay-50'];

  // Model related members
  logger = inject(LoggerService);
  weddingService = inject(WeddingService);
  @Inject({})
  private renderer = inject(Renderer2);
  invitation?: Invitation | undefined;
  loading = true;

  subscriptions: Subscription[] = [];

  // View related members
  @ViewChild('music') musicElement: ElementRef | undefined;

  eventDate: Date = new Date('2024-12-15T14:30:00.000+07:00');

  isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser.set(isPlatformBrowser(platformId));
  }

  ngOnInit() {
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
        const musics = document.querySelectorAll('audio[autoplay]') as NodeListOf<HTMLAudioElement>;
        musics.forEach(async (music) => {
          try {
            await music.play();
          } catch (err) {
            this.logger.error(`can't play music: ${err}`);
          }
        });
      });
      document.addEventListener('visibilitychange', () => {
        const musics = document.querySelectorAll('audio[autoplay]') as NodeListOf<HTMLAudioElement>;
        if (document.hidden) {
          musics.forEach(async (music) => {
            try {
              await music.pause();
            } catch (err) {
              this.logger.error(`can't pause music: ${err}`);
            }
          });
        } else {
          musics.forEach(async (music) => {
            try {
              await music.play();
            } catch (err) {
              this.logger.error(`can't play music: ${err}`);
            }
          });
        }
      });
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

  toggleMusicPlay() {
    this.setMusicPlay(!this.isMusicPlaying);
  }

  setMusicPlay(play: boolean) {
    const music: HTMLAudioElement = this.musicElement?.nativeElement;
    if (play) {
      music.play();
    } else {
      music.pause();
    }
  }

  get isMusicPlaying() {
    const music: HTMLAudioElement = this.musicElement?.nativeElement;
    if (!music) return false;
    return !music.paused;
  }

  get getFirstSectionText() {
    if (this.invitation) {
      return this.kFirstSectionText[1];
    }
    return this.kFirstSectionText[0];
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
}
