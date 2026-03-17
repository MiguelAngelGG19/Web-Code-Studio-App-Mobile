import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← AGREGA
import { IonicModule } from '@ionic/angular';
import { loginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { HttpClientModule } from '@angular/common/http'; // ← AGREGA

@NgModule({
  imports: [
    CommonModule,
    FormsModule,       // ← AGREGA
    IonicModule,
    loginPageRoutingModule,
    HttpClientModule,  // ← AGREGA
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
