import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyProgressPage } from './my-progress.page';

const routes: Routes = [
  {
    path: '',
    component: MyProgressPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProgressPageRoutingModule {}
