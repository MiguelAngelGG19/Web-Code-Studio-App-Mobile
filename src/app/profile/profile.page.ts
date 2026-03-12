import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage {

  constructor(private router: Router) {}

  // Esta función se ejecuta al tocar el botón rojo
  cerrarSesion() {
    console.log('Cerrando sesión...');
    // Aquí limpias el storage si tienes, y lo mandas al login
    this.router.navigate(['/login']); 
  }
}