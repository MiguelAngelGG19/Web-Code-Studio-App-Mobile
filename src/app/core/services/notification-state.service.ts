import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationStateService {
  private _hasUnread = new BehaviorSubject<boolean>(false);
  hasUnread$ = this._hasUnread.asObservable();

  setHasUnread(value: boolean) {
    this._hasUnread.next(value);
  }
}
