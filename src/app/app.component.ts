import { Component, OnInit } from '@angular/core';
import { RouteAnimationService } from './core/services/route-animation.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private routeAnimationService: RouteAnimationService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    // Inicializar Storage UNA sola vez al arrancar la app.
    // El interceptor ya puede hacer storage.get() sin llamar create() cada vez.
    await this.storage.create();
  }
}
