import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

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
  invitation?: Invitation | undefined;

  constructor() {}

  async getInvitation(id: string | undefined) {
    if (!id) return undefined;
    if (this.invitation && this.invitation?.id == id) return this.invitation;
    const res = await fetch(`${this.baseUrl}/wedding/invitation/${id}`, {
      method: 'GET',
      mode: 'cors',
    });
    const { data = undefined } = await res.json();
    if (data) {
      this.invitation = data as unknown as Invitation;
    }
    return this.invitation;
  }

  async updateRsvp(invitation: Invitation, rsvp: Rsvp) {
    const res = await fetch(`${this.baseUrl}/wedding/invitation/${invitation.id}`, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(rsvp),
    });
    const { data = undefined } = await res.json();
    if (data) {
      this.invitation = data as unknown as Invitation;
      return this.invitation;
    }
    return undefined;
  }

  async getMessage(page: number = 0, pageSize: number = 5): Promise<Message[]> {
    const res = await fetch(`${this.baseUrl}/wedding/message?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      mode: 'cors',
    });
    const { data = undefined } = await res.json();
    if (data) {
      return data as unknown as Message[];
    }
    return [];
  }
}
