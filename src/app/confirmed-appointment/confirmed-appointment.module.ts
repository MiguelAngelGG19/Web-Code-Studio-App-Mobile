import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<<< HEAD:src/app/login/login.module.ts
import { LoginPage } from './login.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { loginPageRoutingModule } from './login-routing.module';
========
import { ConfirmedAppointmentPage } from './confirmed-appointment.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ConfirmedAppointmentPageRoutingModule } from './confirmed-appointment.routing.module';
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.module.ts

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
<<<<<<<< HEAD:src/app/login/login.module.ts
    loginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
========
    ConfirmedAppointmentPageRoutingModule
  ],
  declarations: [ConfirmedAppointmentPage]
})
export class ConfirmedAppointmentPageModule {}
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.module.ts
