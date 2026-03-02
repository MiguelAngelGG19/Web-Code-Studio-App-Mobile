import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WelcomePage } from './welcome.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { welcomePageRoutingModule } from './welcome-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    welcomePageRoutingModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
