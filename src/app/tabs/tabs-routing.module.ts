import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '', // Al entrar a /tabs...
    component: TabsPage,
    children: [
<<<<<<< HEAD
      
      {
        path: '',
        redirectTo: 'tab3', // Si entras a /tabs, te manda directo a la 3
        pathMatch: 'full'
      }
    ]

=======
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
>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
