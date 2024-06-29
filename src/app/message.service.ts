import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoggerService } from './logger.service';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';

export type Message = {
  id: number;
  name: string;
  message: string;
  created_at: number;
};

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.API_URL;

  http = inject(HttpClient);
  logger = inject(LoggerService);

  needReload = new BehaviorSubject<any>(undefined);

  constructor() {}

  getMessage(page: number, pageSize: number = 5) {
    const salt = new Date().getTime();
    return this.http.get(`${this.baseUrl}/wedding/message?page=${page}&pageSize=${pageSize}&${salt}`);
  }
  getMessageSize() {
    const salt = new Date().getTime();
    return this.http.get(`${this.baseUrl}/wedding/message/size?${salt}`);
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

  notifyNeedReload() {
    this.needReload.next(undefined);
  }
}
