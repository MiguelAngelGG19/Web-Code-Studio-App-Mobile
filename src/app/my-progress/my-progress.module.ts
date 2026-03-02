import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyProgressPageRoutingModule } from './my-progress-routing.module';
import { MyProgressPage } from './my-progress.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProgressPageRoutingModule
  ],
  declarations: [MyProgressPage] // Esto conecta tu lógica con la aplicación
})
export class MyProgressPageModule {}