import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NotificationApiService, Notification } from '../core/infrastructure/api/notification-api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {
  notifications: Notification[] = [];
  loading = true;

  constructor(
    private storage: Storage,
    private notificationApi: NotificationApiService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');
    if (patientId) {
      this.notificationApi.getByPatientId(patientId).subscribe({
        next: (rows) => {
          this.notifications = rows;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  async markAsRead(n: Notification) {
    if (n.isRead) return;
    const patientId = await this.storage.get('currentPatientId');
    if (!patientId) return;
    this.notificationApi.markAsRead(n.id, patientId).subscribe({
      next: (ok) => {
        if (ok) n.isRead = true;
      },
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'rutina':
        return 'barbell-outline';
      case 'recordatorio':
        return 'alarm-outline';
      case 'mensaje':
        return 'chatbubble-outline';
      case 'progreso':
        return 'trending-up-outline';
      case 'consejo':
        return 'bulb-outline';
      default:
        return 'notifications-outline';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'rutina':
        return 'primary';
      case 'recordatorio':
        return 'warning';
      case 'mensaje':
        return 'tertiary';
      case 'progreso':
        return 'success';
      case 'consejo':
        return 'secondary';
      default:
        return 'medium';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
