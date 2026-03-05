import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DetailPageRoutingModule } from './detail-routing.module';
import { DetailPage } from './detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Esencial para que funcionen <ion-card>, <ion-button>, etc.
    DetailPageRoutingModule
  ],
  declarations: [DetailPage]
})
export class DetailPageModule {}