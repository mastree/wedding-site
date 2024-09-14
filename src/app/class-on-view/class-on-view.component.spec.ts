import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassOnViewComponent } from './class-on-view.component';

describe('ClassOnViewComponent', () => {
  let component: ClassOnViewComponent;
  let fixture: ComponentFixture<ClassOnViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassOnViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClassOnViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
