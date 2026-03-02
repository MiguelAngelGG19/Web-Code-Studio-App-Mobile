import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

<<<<<<<< HEAD:src/app/login/login.page.spec.ts
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
========
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
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.page.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
