import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Invitation, WeddingService } from '../wedding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from '../logger.service';
import { Subscription } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { signal } from '@angular/core';
import { HomeLoadingComponent } from '../home-loading/home-loading.component';
import { MainInvitationComponent } from '../main-invitation/main-invitation.component';
import { InvitationEnvelopeComponent } from '../invitation-envelope/invitation-envelope.component';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    @if (loading) {
      <app-home-loading></app-home-loading>
    } @else if (!envelopeOpened) {
      <app-invitation-envelope (envelopeEvent)="onEnvelopeEvent($event)"></app-invitation-envelope>
    } @else {
      <app-main-invitation></app-main-invitation>
    }
  `,
  styleUrl: './home.component.css',
  imports: [HomeLoadingComponent, MainInvitationComponent, InvitationEnvelopeComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Model related members
  logger = inject(LoggerService);
  route = inject(ActivatedRoute);
  weddingService = inject(WeddingService);
  invitation?: Invitation | undefined;
  loading = true;

  envelopeOpened = false;

  subscriptions: Subscription[] = [];
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

  onEnvelopeEvent(doOpen: boolean) {
    this.logger.info(`envelope open: ${doOpen}`);
    this.envelopeOpened = doOpen;
  }
}
