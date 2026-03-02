import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmed-appointment',
  templateUrl: 'confirmed-appointment.page.html',
  styleUrls: ['confirmed-appointment.page.scss'],
  standalone: false,
})
export class ConfirmedAppointmentPage {
  cita: any = {
    doctorName: 'Dr. Alex Rivera',
    specialty: 'Fisioterapeuta Especialista',
    doctorPhoto: 'https://i.pravatar.cc/150?u=dr_alex',
    clinic: 'ACTIVA Health Center',
    fecha: 'Lunes, 24 de Octubre',
    hora: '10:00 AM - 11:00 AM',
    tipoTerapia: 'Terapia Manual Avanzada',
    direccion: 'Calle de la Salud, 123'
  };

  constructor() {}
}