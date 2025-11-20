import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

  proveedores: any[] = [];
  loading = false;
  errorMsg = '';
  showModal = false;

  proveedorForm = {
    id_proveedor: null as number | null,
    nombre: '',
    nit: '',
    direccion: '',
    telefono: '',
    correo: ''
  };

  constructor(private proveedoresService: ProveedoresService) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.loading = true;
    this.errorMsg = '';

    this.proveedoresService.getAll().subscribe({
      next: (resp) => {
        console.log('GET /proveedores =>', resp);

        if (Array.isArray(resp)) {
          this.proveedores = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.proveedores = resp.data;
        } else if (resp.proveedores && Array.isArray(resp.proveedores)) {
          this.proveedores = resp.proveedores;
        } else {
          this.proveedores = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando proveedores', err);
        this.errorMsg = `Error cargando proveedores: ${err.status} ${err.statusText || ''}`;
        this.loading = false;
      }
    });
  }

  openModal(proveedor: any = null): void {
    if (proveedor) {
      this.proveedorForm = {
        id_proveedor: proveedor.id_proveedor ?? proveedor.id ?? null,
        nombre: proveedor.nombre ?? '',
        nit: proveedor.nit ?? '',
        direccion: proveedor.direccion ?? '',
        telefono: proveedor.telefono ?? '',
        correo: proveedor.correo ?? ''
      };
    } else {
      this.resetForm();
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.proveedorForm = {
      id_proveedor: null,
      nombre: '',
      nit: '',
      direccion: '',
      telefono: '',
      correo: ''
    };
  }

  saveProveedor(): void {
    this.errorMsg = '';

    const payload = {
      nombre: this.proveedorForm.nombre,
      nit: this.proveedorForm.nit,
      direccion: this.proveedorForm.direccion,
      telefono: this.proveedorForm.telefono,
      correo: this.proveedorForm.correo
    };

    console.log('Guardando proveedor =>', payload);

    if (this.proveedorForm.id_proveedor) {
      // EDITAR
      this.proveedoresService.update(this.proveedorForm.id_proveedor, payload).subscribe({
        next: (resp) => {
          console.log('PUT /proveedores OK', resp);
          this.loadProveedores();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando proveedor', err);
          this.errorMsg = `Error actualizando proveedor: ${err.status} ${err.statusText || ''}`;
        }
      });
    } else {
      // CREAR
      this.proveedoresService.create(payload).subscribe({
        next: (resp) => {
          console.log('POST /proveedores OK', resp);
          this.loadProveedores();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando proveedor', err);
          this.errorMsg = `Error creando proveedor: ${err.status} ${err.statusText || ''}`;
        }
      });
    }
  }

  deleteProveedor(id_proveedor: number): void {
    if (!confirm('¿Eliminar este proveedor?')) return;

    this.errorMsg = '';

    this.proveedoresService.delete(id_proveedor).subscribe({
      next: (resp) => {
        console.log('DELETE /proveedores OK', resp);
        this.loadProveedores();
      },
      error: (err) => {
        console.error('Error eliminando proveedor', err);
        this.errorMsg = `Error eliminando proveedor: ${err.status} ${err.statusText || ''}`;
      }
    });
  }
}
