import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const API_URL = 'http://TU_IP:3000/api';  // ← cambia TU_IP por tu IP local

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {

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

  async loginConGoogle() {
    const loading = await this.loadingController.create({
      message: 'Verificando con Google...',
    });
    await loading.present();

    try {
      // 1. Abrir Google Sign-In
      const googleUser = await GoogleAuth.signIn();
      const googleToken = googleUser.authentication.idToken;

      if (!googleToken) throw new Error('No se obtuvo token de Google');

      // 2. Mandar token a tu backend
      const response: any = await this.http.post(
        `${API_URL}/auth/google-patient`,
        { googleToken }
      ).toPromise();

      // 3. Guardar JWT y datos del paciente
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

      // 4. Ir al dashboard
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
