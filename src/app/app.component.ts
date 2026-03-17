import { Component } from '@angular/core';
import { RouteAnimationService } from './core/services/route-animation.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'; // ← AGREGA

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private routeAnimationService: RouteAnimationService) {
    GoogleAuth.initialize(); // ← AGREGA AQUÍ DENTRO DEL CONSTRUCTOR
  }
}
