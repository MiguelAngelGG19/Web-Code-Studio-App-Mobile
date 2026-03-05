import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'report',
        loadChildren: () => import('../report/report.module').then(m => m.Tab6PageModule)
      },
      {
        path: 'detail',
        loadChildren: () => import('../detail/detail.module').then(m => m.DetailPageModule)
      },
            {
        path: 'my-progress',
        loadChildren: () => import('../your-progress/your-progress.module').then(m => m.Tab4PageModule)
      },  
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
        redirectTo: 'my-progress',
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
