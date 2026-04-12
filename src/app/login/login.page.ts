import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthApiService } from '../core/infrastructure/api/auth-api.service';
import { SessionService } from '../core/services/session.service';

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
    private session: SessionService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      const t = await this.toastController.create({
        message: 'Ingresa un correo válido',
        duration: 2000,
        position: 'bottom',
        color: 'warning',
      });
      await t.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    const { email } = this.loginForm.value;

    this.authApi.loginPatient(email.trim()).subscribe({
      next: async (res) => {
        await loading.dismiss();
        if (res?.token && res?.patient) {
          await this.session.save(res.patient, res.token);
          const t = await this.toastController.create({
            message: `¡Bienvenido, ${res.patient.firstName}!`,
            duration: 1500,
            position: 'bottom',
            color: 'success',
          });
          await t.present();
          this.router.navigate(['/tabs/your-progress']);
        } else {
          // El back respondió 200 pero sin token/patient — caso inesperado
          const t = await this.toastController.create({
            message: 'Respuesta inesperada del servidor. Intenta de nuevo.',
            duration: 2500,
            position: 'bottom',
            color: 'warning',
          });
          await t.present();
        }
      },
      error: async (err) => {
        await loading.dismiss();
        const msg =
          err?.error?.message ?? 'No se pudo conectar. Verifica tu correo o conexión.';
        const t = await this.toastController.create({
          message: msg,
          duration: 3000,
          position: 'bottom',
          color: 'danger',
        });
        await t.present();
      },
    });
  }
}
