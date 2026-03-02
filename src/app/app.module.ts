import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// RUTA CORRECTA: Un nivel arriba para salir de 'app' y entrar a 'core'
import { UserRepository } from '../core/domain/repositories/user.repository';
import { UserApiService } from '../core/infrastructure/driven-adapters/user-api.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Vinculación vital para que la arquitectura hexagonal funcione
    { provide: UserRepository, useClass: UserApiService }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}