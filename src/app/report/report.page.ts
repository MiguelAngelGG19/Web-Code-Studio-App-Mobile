import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RouteAnimationService } from '../core/services/route-animation.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false
})
export class Tab6Page {
  constructor(
    private router: Router,
    private toastController: ToastController,
    private routeAnimationService: RouteAnimationService
  ) {}

  async sendReport() {
    // Mostrar mensaje de éxito
    const toast = await this.toastController.create({
      message: '✓ Reporte enviado exitosamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'custom-toast'
    });
    
    await toast.present();

    // Navegar a your-progress después de que el toast se muestre
    setTimeout(() => {
      this.routeAnimationService.navigateWithAnimation(['/tabs/your-progress'], 'slide');
    }, 1500);
  }
}