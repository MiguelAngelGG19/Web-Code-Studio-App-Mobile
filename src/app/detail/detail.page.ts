import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { RoutineApiService, RoutineExercise } from '../core/infrastructure/api/routine-api.service';
import { RouteAnimationService } from '../core/services/route-animation.service';
import { getExerciseVideoUrl, getExerciseYouTubeEmbedUrl } from '../core/helpers/exercise-media.helper';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  currentExercise: RoutineExercise | null = null;
  exercises: RoutineExercise[] = [];
  exerciseIndex = 0;
  routineId: number | null = null;
  loading = true;

  constructor(
    private router: Router,
    private storage: Storage,
    private routineApi: RoutineApiService,
    private routeAnimationService: RouteAnimationService
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const routineId = await this.storage.get('currentRoutineId');
    if (!routineId) {
      this.loading = false;
      return;
    }
    this.routineId = routineId;
    this.routineApi.getRoutineById(routineId).subscribe((routine) => {
      this.exercises = routine?.exercises ?? [];
      if (this.exercises.length > 0) {
        this.currentExercise = this.exercises[0];
        this.exerciseIndex = 0;
      }
      this.loading = false;
    });
  }

  goToReport() {
    this.routeAnimationService.navigateWithAnimation(['/tabs/report'], 'slide');
  }

  nextExercise() {
    if (this.exerciseIndex < this.exercises.length - 1) {
      this.exerciseIndex++;
      this.currentExercise = this.exercises[this.exerciseIndex];
    }
  }

  prevExercise() {
    if (this.exerciseIndex > 0) {
      this.exerciseIndex--;
      this.currentExercise = this.exercises[this.exerciseIndex];
    }
  }

  getExerciseVideoUrl = getExerciseVideoUrl;
  getExerciseYouTubeEmbedUrl = getExerciseYouTubeEmbedUrl;
}
