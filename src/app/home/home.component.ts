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

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    @if (loading) {
      <app-home-loading></app-home-loading>
    } @else {
      <app-main-invitation></app-main-invitation>
    }
  `,
  styleUrl: './home.component.css',
  imports: [HomeLoadingComponent, MainInvitationComponent],
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
}
