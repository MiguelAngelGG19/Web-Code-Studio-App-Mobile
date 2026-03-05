import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteAnimationService } from '../core/services/route-animation.service';

@Component({
  selector: 'app-welcome',
  templateUrl: 'welcome.page.html',
  styleUrls: ['welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {

  constructor(
    private router: Router,
    private routeAnimationService: RouteAnimationService
  ) {}

  ngOnInit() {
    // Navegar a login después de 6 segundos con animación fade
    setTimeout(() => {
      this.routeAnimationService.navigateWithAnimation(['/login'], 'fade');
    }, 6000);
  }

}
