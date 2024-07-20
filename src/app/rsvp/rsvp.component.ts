import { Component, ElementRef, Inject, OnDestroy, Renderer2, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Invitation, WeddingService } from '../wedding.service';
import { MessageComponent } from '../message/message.component';
import { NgClass } from '@angular/common';
import { ShowMessageComponent } from '../show-message/show-message.component';
import { Subscription } from 'rxjs';
import { LoggerService } from '../logger.service';

type RsvpState = {
  invitation?: Invitation | undefined;
  numAttend: number;
  willAttend: boolean;
  rsvpPicked: boolean;
  loading: boolean;
  status?: undefined | 'sending' | 'sent' | 'error';
};

@Component({
  selector: 'app-rsvp',
  standalone: true,
  template: `
    <div class="flex w-full flex-col items-center justify-center" #container>
      <div class="flex w-[90%] items-center justify-center pb-16 pt-8">
        <div class="flex w-full flex-col items-center justify-center gap-5">
          <p class="font-regular w-full text-center align-top font-manuale text-3xl font-semibold text-white">RSVP</p>
          <div class="relative flex w-full flex-col items-center justify-center gap-5">
            <div
              class="pointer-events-none absolute z-10 flex items-center justify-center opacity-100"
              [ngClass]="state.loading ? '' : 'hidden'"
            >
              <div class="size-8 fill-white">
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
            </div>
            @if (alreadyFilled) {
              <div class="flex w-full flex-col items-center">
                <div class="flex flex-row items-center gap-4">
                  <p class="text-md font-manuale text-white">You have filled the RSVP</p>
                  <button
                    (click)="onUpdateRsvp()"
                    class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-white hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
                  >
                    update
                  </button>
                </div>
              </div>
              <div class="pointer-events-none absolute flex h-full w-full items-center justify-center">
                <div
                  class="fill-mode-forwards invisible rounded-lg border-2 border-black bg-secondary px-3 py-5 shadow-lg"
                  [ngClass]="state.status == 'sent' ? 'animate-notify-scale-in' : 'hidden'"
                >
                  <p class="text-md font-manuale text-white">Thanks for filling the RSVP!</p>
                </div>
              </div>
            } @else {
              <div
                class="flex w-full flex-col items-center justify-center gap-5"
                [ngClass]="state.loading || !state.invitation ? ['pointer-events-none', 'opacity-60'] : ''"
              >
                <div class="flex w-full flex-col items-center">
                  <p class="text-md font-manuale text-white">Would you be able to attend?</p>
                  <div class="mt-2 flex w-full flex-col gap-2">
                    <button
                      (click)="onWillAttend(true)"
                      class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-white hover:ring-2 focus:bg-light-primary focus:shadow-primary focus:ring-2 active:shadow-inner md:p-3"
                      [disabled]="!isInvited"
                      #buttonYesAttend
                    >
                      Yes, I will attend
                    </button>
                    <button
                      (click)="onWillAttend(false)"
                      class="rounded-lg bg-slate-100 p-2 font-manuale font-semibold text-primary ring-white hover:ring-2 focus:bg-red-100 focus:shadow-red-200 focus:ring-2 active:shadow-inner md:p-3"
                      [disabled]="!isInvited"
                      #buttonNoAttend
                    >
                      No
                    </button>
                  </div>
                </div>
                @if (state.willAttend) {
                  <div class="flex w-full flex-col items-center">
                    <p class="font-manuale text-sm text-white">How many person? (including yourself)</p>
                    <div class="mt-2 flex w-full flex-row justify-between gap-1">
                      <button
                        (click)="onAddNumAttend(-1)"
                        [disabled]="state.numAttend <= 0"
                        class="rounded-lg bg-slate-100 px-5 py-1 font-manuale text-xl font-bold text-primary ring-white hover:ring-2 active:bg-red-100 active:shadow-inner active:shadow-red-200 active:ring-2 disabled:pointer-events-none disabled:opacity-60"
                      >
                        -
                      </button>
                      <div class="grow rounded-lg bg-white px-2 py-2 font-manuale">
                        <p>{{ state.numAttend }}</p>
                      </div>
                      <button
                        (click)="onAddNumAttend(1)"
                        [disabled]="state.numAttend >= (state.invitation?.invitation_pax || 0)"
                        class="rounded-lg bg-dark-secondary px-5 py-1 font-manuale text-xl font-bold text-white ring-white hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 disabled:pointer-events-none disabled:opacity-60"
                      >
                        +
                      </button>
                    </div>
                  </div>
                } @else {}
                @if (state.rsvpPicked) {
                  <div class="flex flex-row items-center gap-5">
                    <p class="text-md font-manuale text-white">Confirm RSVP?</p>
                    <div class="flex flex-row items-center gap-2">
                      <button
                        (click)="onSubmitRsvp(true)"
                        class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-white hover:ring-2 active:bg-light-primary active:shadow-inner active:shadow-primary active:ring-2 md:p-3"
                      >
                        Confirm
                      </button>
                      <button
                        (click)="onSubmitRsvp(false)"
                        class="rounded-lg bg-slate-100 p-2 font-manuale font-semibold text-primary ring-white hover:ring-2 active:bg-red-100 active:shadow-inner active:shadow-red-200 active:ring-2 md:p-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
          <div class="my-3 h-[2px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full">
            <app-message></app-message>
          </div>
          <div class="my-3 h-[2px] w-full bg-dark-secondary opacity-30"></div>
          <div class="w-full">
            <app-show-message></app-show-message>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './rsvp.component.css',
  imports: [FormsModule, MessageComponent, NgClass, ShowMessageComponent],
})
export class RsvpComponent implements OnDestroy {
  logger = inject(LoggerService);
  weddingService = inject(WeddingService);

  state: RsvpState = {
    numAttend: 0,
    willAttend: false,
    rsvpPicked: false,
    loading: false,
  };

  isInvited: boolean = false;

  @ViewChild('container') outerContainer: ElementRef | undefined;
  @ViewChild('buttonYesAttend') buttonYesAttend: ElementRef | undefined;
  @ViewChild('buttonNoAttend') buttonNoAttend: ElementRef | undefined;
  @Inject({})
  private renderer = inject(Renderer2);

  subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(
      this.weddingService.invitation.subscribe((data) => {
        this.state.invitation = data.invitation;
        this.state.loading = data.status == 'loading';
        this.isInvited = this.state.invitation != undefined && !this.state.loading;
        this.logger.debug(
          `[RSVP page] invitation = ${JSON.stringify(this.state.invitation)}, alreadyFilled = ${this.alreadyFilled}`,
        );
      }),
    );
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
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

  onWillAttend(willAttend: boolean) {
    this.state.rsvpPicked = true;
    this.state.willAttend = willAttend;
    if (this.state.willAttend) {
      this.addClasses(this.buttonYesAttend?.nativeElement, ['shadow-primary', 'ring-2', 'bg-light-primary']);
      this.removeClasses(this.buttonNoAttend?.nativeElement, ['shadow-red-200', 'ring-2', 'bg-red-100']);
    } else {
      this.state.numAttend = 0;
      this.removeClasses(this.buttonYesAttend?.nativeElement, ['shadow-primary', 'ring-2', 'bg-light-primary']);
      this.addClasses(this.buttonNoAttend?.nativeElement, ['shadow-red-200', 'ring-2', 'bg-red-100']);
    }
  }

  onAddNumAttend(inc: number) {
    if (this.state.invitation) {
      this.state.numAttend = Math.min(this.state.invitation!.invitation_pax, Math.max(0, this.state.numAttend + inc));
    }
  }

  onUpdateRsvp() {
    this.state.invitation!.rsvp = undefined;
  }

  onSubmitRsvp(submit: boolean = true) {
    if (submit) {
      if (this.state.willAttend && this.state.numAttend == 0) {
        window.alert('Number of attendee must be more than 0!');
        return;
      }
      this.state.status = 'sending';
      this.state.loading = true;
      this.weddingService.updateRsvp(this.state.invitation!, {
        will_attend: this.state.willAttend,
        num_attendee: this.state.numAttend,
      });
      this.state.status = 'sent';
    } else {
      this.state.rsvpPicked = false;
      this.state.willAttend = false;
      this.removeClasses(this.buttonNoAttend?.nativeElement, ['shadow-red-200', 'ring-2', 'bg-red-100']);
      this.removeClasses(this.buttonYesAttend?.nativeElement, ['shadow-primary', 'ring-2', 'bg-light-primary']);
    }
  }

  get alreadyFilled() {
    if (!this.state.invitation || !this.state.invitation.rsvp) return false;
    return this.state.invitation.rsvp.will_attend === true || this.state.invitation.rsvp.will_attend === false;
  }
}
