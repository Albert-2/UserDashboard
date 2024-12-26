import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.headers.authorization?.split(' ')[1];
    if (!idToken) {
      throw new Error('Unauthorized');
    }

    return this.firebaseService.verifyIdToken(idToken).then(
      (decodedToken) => {
        request.user = decodedToken;
        return true;
      },
      () => {
        throw new Error('Unauthorized');
      },
    );
  }
}
