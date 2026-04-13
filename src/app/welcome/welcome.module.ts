import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WelcomePage } from './welcome.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { welcomePageRoutingModule } from './welcome-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ExploreContainerComponentModule,
    welcomePageRoutingModule
  ],
  declarations: [WelcomePage]
})
export class WelcomePageModule {}
