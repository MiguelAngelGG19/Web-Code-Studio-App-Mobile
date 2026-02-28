import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract getUserById(id: string): Observable<User>;
  abstract getAllUsers(): Observable<User[]>;
}