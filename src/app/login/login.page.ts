import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://192.168.1.4:3000/api';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {

  email: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private storage: Storage,
    private http: HttpClient
  ) {}

  async ionViewWillEnter() {
    await this.storage.create();
  }

  async loginConCorreo() {
    if (!this.email || !this.email.includes('@')) {
      const toast = await this.toastController.create({
        message: 'Ingresa un correo válido.',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando correo...',
    });
    await loading.present();

    try {
      const response: any = await this.http.post(
        `${API_URL}/auth/login-patient`,
        { email: this.email }
      ).toPromise();

      await this.storage.set('token', response.token);
      await this.storage.set('currentPatient', response.patient);

      await loading.dismiss();

      const toast = await this.toastController.create({
        message: `Bienvenido, ${response.patient.firstName} 👋`,
        duration: 1500,
        position: 'bottom',
        color: 'success',
      });
      await toast.present();

      this.router.navigate(['/tabs/your-progress']);

    } catch (error: any) {
      await loading.dismiss();
      const mensaje = error?.error?.message || 'No estás registrado. Contacta a tu fisioterapeuta.';
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
      await toast.present();
    }
  }
}
