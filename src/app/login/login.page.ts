import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AuthApiService } from '../core/infrastructure/api/auth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authApi: AuthApiService,
    private storage: Storage
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  async ionViewWillEnter() {
    await this.storage.create();
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Ingresa un correo y contraseña válidos',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    this.authApi.loginPatient(email.trim(), password).subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res.success && res.token) {
          // Guardar token y datos del paciente en Storage
          await this.storage.set('patient_token', res.token);
          await this.storage.set('currentPatientId', res.patient.id);
          await this.storage.set('currentPatient', res.patient);

          const toast = await this.toastController.create({
            message: `¡Bienvenido, ${res.patient.firstName}!`,
            duration: 1500,
            position: 'bottom',
            color: 'success',
          });
          await toast.present();
          this.router.navigate(['/tabs/your-progress']);
        }
      },
      error: async () => {
        await loading.dismiss();
        const toast = await this.toastController.create({
          message: 'Correo o contraseña incorrectos.',
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await toast.present();
      },
    });
  }
}
