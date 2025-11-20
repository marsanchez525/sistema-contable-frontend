import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturasService } from '../../../services/facturas.service';
import { ClientesService } from '../../../services/clientes.service';
import { ProveedoresService } from '../../../services/proveedores.service';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.scss']
})
export class FacturasComponent implements OnInit {

  facturas: any[] = [];
  clientes: any[] = [];
  proveedores: any[] = [];

  loading = false;
  errorMsg = '';
  showModal = false;

  facturaForm = {
    id_factura: null as number | null,
    id_cliente: null as number | null,
    id_proveedor: null as number | null,
    fecha_emision: '',
    total: 0,
    estado: ''
  };

  constructor(
    private facturasService: FacturasService,
    private clientesService: ClientesService,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.loadClientesYProveedores();
    this.loadFacturas();
  }

  loadClientesYProveedores(): void {
    // CLIENTES
    this.clientesService.getAll().subscribe({
      next: (resp: any) => {
        console.log('GET /clientes =>', resp);
        if (Array.isArray(resp)) {
          this.clientes = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.clientes = resp.data;
        } else {
          this.clientes = [];
        }
      },
      error: (err) => {
        console.error('Error cargando clientes para facturas', err);
      }
    });

    // PROVEEDORES
    this.proveedoresService.getAll().subscribe({
      next: (resp: any) => {
        console.log('GET /proveedores =>', resp);
        if (Array.isArray(resp)) {
          this.proveedores = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.proveedores = resp.data;
        } else {
          this.proveedores = [];
        }
      },
      error: (err) => {
        console.error('Error cargando proveedores para facturas', err);
      }
    });
  }

  loadFacturas(): void {
    this.loading = true;
    this.errorMsg = '';

    this.facturasService.getAll().subscribe({
      next: (resp) => {
        console.log('GET /facturas =>', resp);

        if (Array.isArray(resp)) {
          this.facturas = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.facturas = resp.data;
        } else if (resp.facturas && Array.isArray(resp.facturas)) {
          this.facturas = resp.facturas;
        } else {
          this.facturas = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando facturas', err);
        this.errorMsg = `Error cargando facturas: ${err.status} ${err.statusText || ''}`;
        this.loading = false;
      }
    });
  }

  openModal(factura: any = null): void {
    if (factura) {
      this.facturaForm = {
        id_factura: factura.id_factura ?? null,
        id_cliente: factura.id_cliente ?? null,
        id_proveedor: factura.id_proveedor ?? null,
        fecha_emision: factura.fecha_emision
          ? factura.fecha_emision.substring(0, 10)
          : '',
        total: Number(factura.total ?? 0),
        estado: factura.estado ?? ''
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
    this.facturaForm = {
      id_factura: null,
      id_cliente: null,
      id_proveedor: null,
      fecha_emision: '',
      total: 0,
      estado: ''
    };
  }

  saveFactura(): void {
    this.errorMsg = '';

    const payload = {
      id_cliente: this.facturaForm.id_cliente,
      id_proveedor: this.facturaForm.id_proveedor,
      fecha_emision: this.facturaForm.fecha_emision,
      total: this.facturaForm.total,
      estado: this.facturaForm.estado
    };

    console.log('Guardando factura =>', payload);

    if (this.facturaForm.id_factura) {
      this.facturasService.update(this.facturaForm.id_factura, payload).subscribe({
        next: (resp) => {
          console.log('PUT /facturas OK', resp);
          this.loadFacturas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando factura', err);
          this.errorMsg = `Error actualizando factura: ${err.status} ${err.statusText || ''}`;
        }
      });
    } else {
      this.facturasService.create(payload).subscribe({
        next: (resp) => {
          console.log('POST /facturas OK', resp);
          this.loadFacturas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando factura', err);
          console.log('Detalle Laravel:', err.error);
          if (err.status === 422 && err.error && err.error.errors) {
            const mensajes: string[] = [];
            Object.keys(err.error.errors).forEach(campo => {
              err.error.errors[campo].forEach((m: string) => mensajes.push(m));
            });
            this.errorMsg = mensajes.join(' | ');
          } else {
            this.errorMsg = `Error creando factura: ${err.status} ${err.statusText || ''}`;
          }
        }
      });
    }
  }

  deleteFactura(id_factura: number): void {
    if (!confirm('¿Eliminar esta factura?')) return;

    this.errorMsg = '';

    this.facturasService.delete(id_factura).subscribe({
      next: (resp) => {
        console.log('DELETE /facturas OK', resp);
        this.loadFacturas();
      },
      error: (err) => {
        console.error('Error eliminando factura', err);
        this.errorMsg = `Error eliminando factura: ${err.status} ${err.statusText || ''}`;
      }
    });
  }

  // Ganchos para exportar (cuando tengas endpoints de PDF/Excel)
  exportPdf(id_factura: number): void {
    window.open(`http://127.0.0.1:8000/api/facturas/${id_factura}/pdf`, '_blank');
  }

  exportExcel(id_factura: number): void {
    window.open(`http://127.0.0.1:8000/api/facturas/${id_factura}/excel`, '_blank');
  }
}
