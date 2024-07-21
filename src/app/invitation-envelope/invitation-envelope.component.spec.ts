import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationEnvelopeComponent } from './invitation-envelope.component';

describe('InvitationEnvelopeComponent', () => {
  let component: InvitationEnvelopeComponent;
  let fixture: ComponentFixture<InvitationEnvelopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationEnvelopeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationEnvelopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
