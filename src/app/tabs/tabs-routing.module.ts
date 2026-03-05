import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '', // Al entrar a /tabs...
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
        path: '',
        redirectTo: 'report',
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
