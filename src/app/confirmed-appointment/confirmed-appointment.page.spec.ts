import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ConfirmedAppointmentPage } from './confirmed-appointment.page';

describe('ConfirmedAppointmentPage', () => {
  let component: ConfirmedAppointmentPage;
  let fixture: ComponentFixture<ConfirmedAppointmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmedAppointmentPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmedAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
