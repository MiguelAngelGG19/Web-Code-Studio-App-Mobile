import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { MyProgressPage } from './my-progress.page';
import { GetUserProfileUseCase } from '../../core/usecases/get-user-profile.usecase';
import { UserRepository } from '../../core/domain/repositories/user.repository';

const mockUser = { id: 1, fullName: 'Test User', email: 'test@test.com', progress: 0.5 };

describe('MyProgressPage', () => {
  let component: MyProgressPage;
  let fixture: ComponentFixture<MyProgressPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyProgressPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
      providers: [
        GetUserProfileUseCase,
        { provide: UserRepository, useValue: { getUserById: () => of(mockUser) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyProgressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(component.user).toEqual(mockUser);
  });
});
