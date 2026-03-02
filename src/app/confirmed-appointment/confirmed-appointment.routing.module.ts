import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<<< HEAD:src/app/welcome/welcome-routing.module.ts
import { WelcomePage } from './welcome.page';
========
import { ConfirmedAppointmentPage } from './confirmed-appointment.page';
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.routing.module.ts

const routes: Routes = [
  {
    path: '',
<<<<<<<< HEAD:src/app/welcome/welcome-routing.module.ts
    component: WelcomePage,
========
    component: ConfirmedAppointmentPage,
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.routing.module.ts
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
<<<<<<<< HEAD:src/app/welcome/welcome-routing.module.ts
export class welcomePageRoutingModule {}
========
export class ConfirmedAppointmentPageRoutingModule {}
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/confirmed-appointment/confirmed-appointment.routing.module.ts
