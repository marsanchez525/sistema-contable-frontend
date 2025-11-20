import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  private http = inject(HttpClient);

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`);
  }

  getCuentas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cuentas-contables`);
  }

  getFacturas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/facturas`);
  }

  getTransacciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/transacciones`);
  }
}
