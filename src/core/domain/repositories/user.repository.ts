import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export abstract class UserRepository {
  abstract getUserById(id: number): Observable<User>;
}
