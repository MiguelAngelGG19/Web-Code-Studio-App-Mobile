import { Component, OnInit } from '@angular/core';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private session: SessionService) {}

  async ngOnInit() {
    // Inicializa la sesión (carga Storage o pone el mock)
    await this.session.init();
  }
}
