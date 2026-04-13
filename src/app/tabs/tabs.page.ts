import { Component, OnInit } from '@angular/core';
import { NotificationStateService } from '../core/services/notification-state.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {
  hasUnreadNotifications = false;

  constructor(private notificationState: NotificationStateService) {}

  ngOnInit() {
    this.notificationState.hasUnread$.subscribe(val => {
      this.hasUnreadNotifications = val;
    });
  }
}
