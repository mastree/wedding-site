import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainInvitationComponent } from './main-invitation.component';

describe('MainInvitationComponent', () => {
  let component: MainInvitationComponent;
  let fixture: ComponentFixture<MainInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainInvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
