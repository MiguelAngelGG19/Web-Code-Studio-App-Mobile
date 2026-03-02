import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'my-progress',
        loadChildren: () => import('../my-progress/my-progress-routing.module').then(m => m.MyProgressPageRoutingModule)
      },
      {
        path: 'confirmed-appointment',
        loadChildren: () => import('../confirmed-appointment/confirmed-appointment.module').then(m => m.ConfirmedAppointmentPageModule)
      },
     
      {
        path: '',
        redirectTo: '/tabs/my-progress',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/my-progress',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
