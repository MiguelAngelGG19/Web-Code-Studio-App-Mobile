import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { RegisterPainLevelUseCase } from '../../core/usecases/register-pain-level.usecase';
import { Tracking } from '../../core/domain/models/tracking.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
  standalone: false
})
export class Tab6Page implements OnInit {
  reportForm: FormGroup;
  selectedPainLevel: number | null = null;
  isLoading = false;
  currentRoutineId: number = 1; // Default fallback

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private routeAnimationService: RouteAnimationService,
    private registerPainLevelUseCase: RegisterPainLevelUseCase
  ) {
    this.reportForm = this.formBuilder.group({
      painLevel: [null, Validators.required],
      observations: ['']
    });
  }

  async ngOnInit() {
    // Inicializar storage
    await this.storage.create();

    // Intentar obtener routineId de diferentes fuentes
    await this.loadCurrentRoutineId();
  }

  private async loadCurrentRoutineId() {
    // 1. Primero intentar desde parámetros de ruta
    const routeRoutineId = this.route.snapshot.paramMap.get('routineId');
    if (routeRoutineId) {
      this.currentRoutineId = parseInt(routeRoutineId, 10);
      return;
    }

    // 2. Intentar desde query params
    const queryRoutineId = this.route.snapshot.queryParamMap.get('routineId');
    if (queryRoutineId) {
      this.currentRoutineId = parseInt(queryRoutineId, 10);
      return;
    }

    // 3. Intentar desde storage local
    const storedRoutineId = await this.storage.get('currentRoutineId');
    if (storedRoutineId) {
      this.currentRoutineId = storedRoutineId;
      return;
    }

    // 4. Intentar desde storage del usuario actual
    const currentUser = await this.storage.get('currentUser');
    if (currentUser && currentUser.currentRoutineId) {
      this.currentRoutineId = currentUser.currentRoutineId;
      return;
    }

    // Si no se encuentra, mantener el default (1)
    console.warn('No se encontró routineId, usando default:', this.currentRoutineId);
  }

  selectPainLevel(level: number) {
    this.selectedPainLevel = level;
    this.reportForm.patchValue({ painLevel: level });
  }

  async sendReport() {
    if (this.reportForm.invalid) {
      const toast = await this.toastController.create({
        message: 'Por favor selecciona un nivel de dolor',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Enviando reporte...'
    });
    await loading.present();

    const formValue = this.reportForm.value;

    // Crear objeto Tracking
    // Construir el objeto sin el campo id
    const tracking = {
      startTime: new Date().toTimeString().split(' ')[0], // HH:MM:SS
      endTime: new Date().toTimeString().split(' ')[0],
      painLevel: Number(formValue.painLevel),
      postObservations: formValue.observations,
      intraObservations: '',
      alert: formValue.painLevel >= 7 ? 1 : 0, // Debe ser 0 o 1
      routineId: Number(this.currentRoutineId)
    };

    this.registerPainLevelUseCase.execute(tracking).subscribe({
      next: async () => {
        await loading.dismiss();
        this.isLoading = false;

        const toast = await this.toastController.create({
          message: '✓ Reporte enviado exitosamente',
          duration: 2000,
          position: 'bottom',
          color: 'success',
          cssClass: 'custom-toast'
        });

        await toast.present();

        // Resetear formulario
        this.reportForm.reset();
        this.selectedPainLevel = null;

        // Navegar después del toast
        setTimeout(() => {
          this.routeAnimationService.navigateWithAnimation(['/tabs/your-progress'], 'slide');
        }, 1500);
      },
      error: async (error) => {
        await loading.dismiss();
        this.isLoading = false;

        const toast = await this.toastController.create({
          message: 'Error al enviar reporte. Inténtalo de nuevo.',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
        console.error('Error sending report:', error);
      }
    });
  }
}