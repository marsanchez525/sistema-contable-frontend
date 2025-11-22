import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  private currentUserKey = 'currentUser';

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((user: any) => {
          // guardar usuario en localStorage
          localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): any | null {
    const raw = localStorage.getItem(this.currentUserKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() != null;
  }
}
