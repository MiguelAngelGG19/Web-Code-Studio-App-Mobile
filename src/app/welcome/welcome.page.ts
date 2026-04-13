import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiBaseService } from '../core/services/api-base.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage {
  /** Ejemplo: http://192.168.0.15:3000 (sin /api obligatorio) */
  serverUrl = '';
  showConnectionHelp = false;

  constructor(
    private apiBase: ApiBaseService,
    private toast: ToastController
  ) {}

  toggleConnectionHelp() {
    this.showConnectionHelp = !this.showConnectionHelp;
  }

  async saveServerUrl() {
    const v = this.serverUrl.trim();
    if (!v.startsWith('http')) {
      const t = await this.toast.create({
        message: 'Pon una URL que empiece por http:// o https://',
        duration: 2800,
        color: 'warning',
      });
      await t.present();
      return;
    }
    this.apiBase.setManualBase(v);
    const t = await this.toast.create({
      message: 'Guardado. Vuelve a intentar iniciar sesión.',
      duration: 2800,
      color: 'success',
    });
    await t.present();
    this.serverUrl = '';
  }

  async clearServerUrl() {
    this.apiBase.clearManualBase();
    const t = await this.toast.create({
      message: 'Se usa la URL por defecto del proyecto.',
      duration: 2200,
    });
    await t.present();
  }
}
