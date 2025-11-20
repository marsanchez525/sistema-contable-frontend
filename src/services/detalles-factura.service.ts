import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetallesFacturaService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  http = inject(HttpClient);

  getByFactura(id_factura: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/facturas/${id_factura}/detalles`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/detalles-factura`, data);
  }

  update(id_detalle: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/detalles-factura/${id_detalle}`, data);
  }

  delete(id_detalle: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/detalles-factura/${id_detalle}`);
  }
}
