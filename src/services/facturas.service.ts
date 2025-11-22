import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private apiUrl = 'http://127.0.0.1:8000/api/facturas';

  constructor(private http: HttpClient) {}

  /** Obtener todas las facturas */
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /** Obtener una factura por ID */
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** Crear nueva factura */
  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  /** Actualizar factura */
  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  /** Eliminar factura */
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /** 
   * ENVIAR FACTURA A DIAN (simulada)  
   * Backend: POST /api/facturas/{id}/enviar-dian
   */
  enviarDian(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/enviar-dian`, {});
  }
}
