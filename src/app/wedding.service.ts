import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, of, startWith, switchMap, tap } from 'rxjs';
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
  id: number;
  name: string;
  message: string;
  created_at: number;
};

@Injectable({
  providedIn: 'root',
})
export class WeddingService {
  baseUrl = environment.API_URL;

  http = inject(HttpClient);
  logger = inject(LoggerService);

  invitation = new BehaviorSubject<Invitation | undefined>(undefined);

  private needReloadMessage = new Subject<Message | undefined>();

  constructor() {}

  getInvitation(id: string | undefined) {
    if (!id) {
      this.invitation.next(undefined);
      return;
    }
    this.http.get(`${this.baseUrl}/wedding/invitation/${id}`).subscribe({
      next: (res) => {
        this.logger.info(`getInvitation(${id}) response: ${JSON.stringify(res)}`);
        this.invitation.next((res as { data: Invitation | undefined }).data);
      },
      error: (err) => {
        this.logger.error(`getInvitation(${id}) error: ${JSON.stringify(err)}`);
        this.invitation.next(undefined);
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
          this.invitation.next(data);
        },
        error: (err) => {
          this.logger.error(`updateRsvp(${invitation.id}}, ${JSON.stringify(rsvp)}) error: ${JSON.stringify(err)}`);
          this.invitation.next(invitation);
        },
      });
  }

  getMessage(page: number, pageSize: number = 5) {
    return this.needReloadMessage.pipe(
      switchMap((_) => this.http.get(`${this.baseUrl}/wedding/message?page=${page}&pageSize=${pageSize}`)),
    );
  }
  getMessageSize() {
    return this.http.get(`${this.baseUrl}/wedding/message/size`);
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

  signalRefreshMessage(message: Message | undefined = undefined) {
    this.needReloadMessage.next(message);
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
