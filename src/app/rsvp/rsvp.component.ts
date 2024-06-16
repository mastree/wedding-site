import { Component, ElementRef, Inject, Renderer2, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="flex w-full flex-col items-center justify-center">
      <div class="flex w-[90%] items-center justify-center pb-16 pt-8">
        <div class="flex w-full flex-col items-center justify-center gap-5">
          <p class="font-regular w-full text-center align-top font-manuale text-3xl font-semibold text-white">RSVP</p>
          <div class="flex w-full flex-col items-center">
            <p class="text-md font-manuale text-white">Would you be able to attend?</p>
            <div class="mt-2 flex w-full flex-col gap-2">
              <button
                (click)="onWillAttend(true)"
                class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white ring-white focus:bg-light-primary focus:shadow-primary focus:ring-2 active:shadow-inner md:p-3"
                #buttonYesAttend
              >
                Yes, I will attend
              </button>
              <button
                (click)="onWillAttend(false)"
                class="rounded-lg bg-slate-100 p-2 font-manuale font-semibold text-primary ring-white focus:bg-red-100 focus:shadow-red-200 focus:ring-2 active:shadow-inner md:p-3"
                #buttonNoAttend
              >
                No
              </button>
            </div>
          </div>
          @if (willAttend) {
            <div class="flex w-full flex-col items-center">
              <p class="font-manuale text-sm text-white">How many person? (including yourself)</p>
              <div class="mt-2 flex w-full flex-row justify-between gap-1">
                <button
                  (click)="onAddNumAttend(-1)"
                  class="rounded-lg bg-slate-100 px-5 py-1 font-manuale font-semibold text-primary active:bg-red-100 active:shadow-inner active:shadow-red-200"
                >
                  -
                </button>
                <div class="grow rounded-lg bg-white px-2 py-2 font-manuale">
                  <p>{{ numAttend }}</p>
                </div>
                <button
                  (click)="onAddNumAttend(1)"
                  class="rounded-lg bg-dark-secondary px-5 py-1 font-manuale font-semibold text-white active:bg-light-primary active:shadow-inner active:shadow-primary"
                >
                  +
                </button>
              </div>
            </div>
          }
          <div class="flex w-full flex-col items-center gap-2">
            <p class="text-md font-manuale text-white">Leave a message or wishes for bride and groom!</p>
            <form class="flex w-full flex-col gap-2" (submit)="onSubmitMessage($event)">
              <div
                class="grid overflow-hidden text-sm after:invisible after:whitespace-pre-wrap after:border after:px-3.5 after:py-2.5 after:text-inherit after:content-[attr(data-cloned-val)_'_'] after:[grid-area:1/1/2/2] [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:text-inherit [&>textarea]:[grid-area:1/1/2/2]"
              >
                <textarea
                  class="w-full appearance-none text-wrap break-all rounded border border-transparent bg-slate-100 px-3.5 py-2.5 text-slate-600 outline-none selection:bg-indigo-600 selection:text-white hover:border-slate-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                  name="message"
                  id="message"
                  rows="2"
                  onInput="this.parentNode.dataset.clonedVal = this.value"
                  placeholder="Message..."
                  [(ngModel)]="messageText"
                  required
                ></textarea>
              </div>
              <button
                class="rounded-lg bg-dark-secondary p-2 font-manuale font-semibold text-white active:bg-light-primary active:shadow-inner active:shadow-primary md:p-3"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './rsvp.component.css',
})
export class RsvpComponent {
  private maxAttend: number = 2;

  numAttend: number = 0;
  willAttend: boolean = false;
  messageText: string = '';

  @ViewChild('buttonYesAttend') buttonYesAttend: ElementRef | undefined;
  @ViewChild('buttonNoAttend') buttonNoAttend: ElementRef | undefined;
  @Inject({})
  private renderer = inject(Renderer2);

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
    this.willAttend = willAttend;
    if (this.willAttend) {
      this.addClasses(this.buttonYesAttend?.nativeElement, ['shadow-primary', 'ring-2', 'bg-light-primary']);
      this.removeClasses(this.buttonNoAttend?.nativeElement, ['shadow-red-200', 'ring-2', 'bg-red-100']);
    } else {
      this.removeClasses(this.buttonYesAttend?.nativeElement, ['shadow-primary', 'ring-2', 'bg-light-primary']);
      this.addClasses(this.buttonNoAttend?.nativeElement, ['shadow-red-200', 'ring-2', 'bg-red-100']);
    }
  }

  onAddNumAttend(inc: number) {
    this.numAttend = Math.min(this.maxAttend, Math.max(0, this.numAttend + inc));
  }

  onSubmitMessage(event: SubmitEvent) {
    console.log(this.messageText);
  }
}
