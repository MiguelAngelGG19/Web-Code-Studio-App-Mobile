import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { RoutineApiService } from '../core/infrastructure/api/routine-api.service';

@Component({
  selector: 'app-detalle-rutina',
  templateUrl: 'detalle-rutina.page.html',
  styleUrls: ['detalle-rutina.page.scss'],
  standalone: false,
})
export class DetalleRutinaPage implements OnInit {
  isOpenModal = false;
  isOpenModal2 = false;
  isOpenModal3 = false;
  isOpenModal4 = false;
  isOpenModal5 = false;
  isAnimating = false;
  routines: any[] = [];

  constructor(
    private router: Router,
    private routeAnimationService: RouteAnimationService,
    private routineApi: RoutineApiService
  ) {}

  ngOnInit() {
    // Cambia el patientId según el usuario autenticado
    const patientId = 1;
    this.routineApi.getRoutines(patientId).subscribe(res => {
      this.routines = res.data || [];
    });
  }

  onWillPresent() {
    console.log('Modal está a punto de abrirse');
  }

  startRoutine() {
    // Agregar animación
    this.isAnimating = true;
    
    // Esperar a que la animación termine y luego navegar
    setTimeout(() => {
      this.routeAnimationService.navigateWithAnimation(['/rutina-en-progreso'], 'slide');
    }, 300);
  }

  openModal(modalNumber: number) {
    switch(modalNumber) {
      case 1:
        this.isOpenModal = true;
        break;
      case 2:
        this.isOpenModal2 = true;
        break;
      case 3:
        this.isOpenModal3 = true;
        break;
      case 4:
        this.isOpenModal4 = true;
        break;
      case 5:
        this.isOpenModal5 = true;
        break;
    }
  }

  closeModal(modalNumber: number) {
    switch(modalNumber) {
      case 1:
        this.isOpenModal = false;
        break;
      case 2:
        this.isOpenModal2 = false;
        break;
      case 3:
        this.isOpenModal3 = false;
        break;
      case 4:
        this.isOpenModal4 = false;
        break;
      case 5:
        this.isOpenModal5 = false;
        break;
    }
  }

}
