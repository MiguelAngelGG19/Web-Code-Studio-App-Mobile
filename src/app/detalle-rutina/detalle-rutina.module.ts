import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleRutinaPage } from './detalle-rutina.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { detalleRutinaPageRoutingModule } from './detalle-rutina-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    detalleRutinaPageRoutingModule
  ],
  declarations: [DetalleRutinaPage]
})
export class DetalleRutinaPageModule {}
