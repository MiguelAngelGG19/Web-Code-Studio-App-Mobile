import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../../core/domain/models/user.model';
import { GetUserProfileUseCase } from '../../core/usecases/get-user-profile.usecase';

@Component({
  selector: 'app-my-progress',
  templateUrl: 'my-progress.page.html',
  styleUrls: ['my-progress.page.scss'],
  standalone: false,
})
export class MyProgressPage implements OnInit, OnDestroy {
  user: User | null = null;

  private sub?: Subscription;

  constructor(private getUserProfile: GetUserProfileUseCase) {}

  ngOnInit(): void {
    this.sub = this.getUserProfile.execute(1).subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Error loading user profile', err),
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
