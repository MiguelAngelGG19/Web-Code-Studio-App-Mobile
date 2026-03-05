import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '', // Al entrar a /tabs...
    component: TabsPage,
    children: [
      {
        path: 'my-progress',
        loadChildren: () => import('../my-progress/my-progress.module').then(m => m.MyProgressPageModule)
      },
      {
        path: 'confirmed-appointment',
        loadChildren: () => import('../confirmed-appointment/confirmed-appointment.module').then(m => m.ConfirmedAppointmentPageModule)
      },
      {
        path: 'detalle-rutina',
        loadChildren: () => import('../detalle-rutina/detalle-rutina.module').then(m => m.DetalleRutinaPageModule)
      },
      {
        path: '',
        redirectTo: 'my-progress', // Si entras a /tabs, te manda directo a my-progress 
        pathMatch: 'full'
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
