import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab6PageRoutingModule } from './report-routing.module';

import { Tab6Page } from './report.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab6PageRoutingModule
  ],
  declarations: [Tab6Page]
})
export class Tab6PageModule {}
