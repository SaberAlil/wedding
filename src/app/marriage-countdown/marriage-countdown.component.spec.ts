import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriageCountdownComponent } from './marriage-countdown.component';

describe('MarriageCountdownComponent', () => {
  let component: MarriageCountdownComponent;
  let fixture: ComponentFixture<MarriageCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarriageCountdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriageCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
