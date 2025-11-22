import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      // Hay usuario en localStorage → dejar pasar
      return true;
    }

    // No está logueado → mandar a login
    return this.router.parseUrl('/login');
  }
}
