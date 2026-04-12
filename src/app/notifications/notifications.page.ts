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

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get hasUnread(): boolean {
    return this.unreadCount > 0;
  }

  async ngOnInit() {
    await this.storage.create();
    const patientId = await this.storage.get('currentPatientId');
    if (patientId) {
      this.notificationApi.getByPatientId(patientId).subscribe({
        next: (rows) => {
          // Más recientes primero
          this.notifications = rows.sort((a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
          );
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  async markAsRead(n: Notification) {
    if (n.isRead) return;
    const patientId = await this.storage.get('currentPatientId');
    if (!patientId) return;
    // Optimistic update — cambia en pantalla de inmediato sin esperar al back
    n.isRead = true;
    this.notificationApi.markAsRead(n.id, patientId).subscribe({
      error: () => {
        // Si falla revert
        n.isRead = false;
      },
    });
  }

  async markAllAsRead() {
    const unread = this.notifications.filter(n => !n.isRead);
    if (unread.length === 0) return;
    const patientId = await this.storage.get('currentPatientId');
    if (!patientId) return;
    // Optimistic: marca todas en UI de inmediato
    unread.forEach(n => (n.isRead = true));
    unread.forEach(n => {
      this.notificationApi.markAsRead(n.id, patientId).subscribe({
        error: () => { n.isRead = false; },
      });
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'rutina':        return 'barbell-outline';
      case 'recordatorio':  return 'alarm-outline';
      case 'mensaje':       return 'chatbubble-outline';
      case 'progreso':      return 'trending-up-outline';
      case 'consejo':       return 'bulb-outline';
      case 'cita':          return 'calendar-outline';
      default:              return 'notifications-outline';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return 'Ahora';
    if (mins  < 60) return `Hace ${mins} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days  === 1) return 'Ayer';
    if (days  < 7)  return `Hace ${days} días`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  }

  ionViewWillLeave() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
}
