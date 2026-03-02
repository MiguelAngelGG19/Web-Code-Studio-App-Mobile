import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<<< HEAD:src/app/login/login-routing.module.ts
import { LoginPage } from './login.page';
========
import { MyProgressPage } from './my-progress.page';
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/my-progress/my-progress-routing.module.ts

const routes: Routes = [
  {
    path: '',
<<<<<<<< HEAD:src/app/login/login-routing.module.ts
    component: LoginPage,
========
    component: MyProgressPage,
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/my-progress/my-progress-routing.module.ts
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
<<<<<<<< HEAD:src/app/login/login-routing.module.ts
export class loginPageRoutingModule {}
========
export class MyProgressPageRoutingModule {}
>>>>>>>> a11986e07db9cfca6f9d4e244907bc28c3eceed1:src/app/my-progress/my-progress-routing.module.ts
