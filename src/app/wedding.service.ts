import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, catchError, map, of, startWith, tap } from 'rxjs';
import { error } from 'console';
import { LoggerService } from './logger.service';

export type Rsvp = {
  will_attend: boolean | undefined;
  num_attendee: number | undefined;
};

export type Invitation = {
  created_at: number;
  name: string;
  id: string;
  invitation_pax: number;
  rsvp?: Rsvp;
};

export type Load<T> = {
  value?: T | undefined;
  loading: boolean;
};

export type Message = {
  name: string;
  message: string;
  created_at?: number;
};

@Injectable({
  providedIn: 'root',
})
export class WeddingService {
  baseUrl = environment.API_URL;

  http = inject(HttpClient);
  logger = inject(LoggerService);

  private invitationResponse = new Subject<any>();
  invitation: Observable<Load<Invitation>> = this.invitationResponse.pipe(
    tap((res) => {
      this.logger.debug(`try to set invitation: ${JSON.stringify(res)}`);
    }),
    map((res) => {
      return {
        value: res.data as Invitation,
        loading: false,
      };
    }),
    startWith({
      loading: true,
    }),
    catchError((_) => {
      return of({
        loading: false,
      });
    }),
  );

  constructor() {}

  getInvitation(id: string | undefined) {
    if (!id) {
      this.invitationResponse.next(undefined);
      return;
    }
    this.http.get(`${this.baseUrl}/wedding/invitation/${id}`).subscribe({
      next: (res) => {
        this.logger.info(`getInvitation(${id}) response: ${JSON.stringify(res)}`);
        this.invitationResponse.next(res);
      },
      error: (err) => {
        this.logger.error(`getInvitation(${id}) error: ${JSON.stringify(err)}`);
        return of({ data: undefined });
      },
    });
  }

  updateRsvp(invitation: Invitation, rsvp: Rsvp) {
    this.http
      .post(`${this.baseUrl}/wedding/invitation/${invitation.id}`, rsvp, {
        observe: 'body',
      })
      .subscribe({
        next: (res) => {
          this.logger.info(`updateRsvp(${invitation.id}}, ${JSON.stringify(rsvp)}) response: ${JSON.stringify(res)}`);
          const { data } = res as { data: Invitation };
          this.invitationResponse.next({ data });
        },
        error: (err) => {
          this.logger.error(`updateRsvp(${invitation.id}}, ${JSON.stringify(rsvp)}) error: ${JSON.stringify(err)}`);
          this.invitationResponse.next({
            data: invitation,
          });
        },
      });
  }

  getMessage(page: number, pageSize: number = 5) {
    return this.http.get(`${this.baseUrl}/wedding/message?page=${page}&pageSize=${pageSize}`);
  }

  sendMessage(name: string, message: string) {
    return this.http.post(
      `${this.baseUrl}/wedding/message`,
      {
        name,
        message,
      },
      {
        observe: 'body',
      },
    );
  }

  downloadInvitationPdf(name: string) {
    return this.http.post(
      `${this.baseUrl}/wedding/invitation/pdf`,
      { name },
      {
        observe: 'body',
        responseType: 'blob',
        headers: {
          Accept: ['application/pdf', 'application/json'],
        },
      },
    );
  }
}
