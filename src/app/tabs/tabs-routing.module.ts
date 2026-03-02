import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '', // Al entrar a /tabs...
    component: TabsPage,
    children: [
      
      {
        path: '',
        redirectTo: 'tab3', // Si entras a /tabs, te manda directo a la 3
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
