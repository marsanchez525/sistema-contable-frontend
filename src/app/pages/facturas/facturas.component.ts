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

  // 🔹 CARGA CLIENTES Y PROVEEDORES
  loadClientesYProveedores(): void {
    this.clientesService.getAll().subscribe({
      next: (resp: any) => {
        this.clientes = Array.isArray(resp) ? resp : (resp.data || []);
      },
      error: (err) => console.error('Error cargando clientes', err)
    });

    this.proveedoresService.getAll().subscribe({
      next: (resp: any) => {
        this.proveedores = Array.isArray(resp) ? resp : (resp.data || []);
      },
      error: (err) => console.error('Error cargando proveedores', err)
    });
  }

  // 🔹 CARGAR FACTURAS
  loadFacturas(): void {
    this.loading = true;
    this.errorMsg = '';

    this.facturasService.getAll().subscribe({
      next: (resp) => {
        if (Array.isArray(resp)) this.facturas = resp;
        else if (resp.data) this.facturas = resp.data;
        else if (resp.facturas) this.facturas = resp.facturas;
        else this.facturas = [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando facturas', err);
        this.errorMsg = `Error cargando facturas: ${err.status}`;
        this.loading = false;
      }
    });
  }

  // 🔹 ABRIR MODAL
  openModal(factura: any = null): void {
    if (factura) {
      this.facturaForm = {
        id_factura: factura.id_factura ?? null,
        id_cliente: factura.id_cliente ?? null,
        id_proveedor: factura.id_proveedor ?? null,
        fecha_emision: factura.fecha_emision?.substring(0, 10) || '',
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

  // 🔹 GUARDAR FACTURA
  saveFactura(): void {
    const payload = {
      id_cliente: this.facturaForm.id_cliente,
      id_proveedor: this.facturaForm.id_proveedor,
      fecha_emision: this.facturaForm.fecha_emision,
      total: this.facturaForm.total,
      estado: this.facturaForm.estado
    };

    this.errorMsg = '';

    if (this.facturaForm.id_factura) {
      // UPDATE
      this.facturasService.update(this.facturaForm.id_factura, payload).subscribe({
        next: () => {
          this.loadFacturas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando', err);
          this.errorMsg = `Error actualizando factura: ${err.status}`;
        }
      });
    } else {
      // CREATE
      this.facturasService.create(payload).subscribe({
        next: () => {
          this.loadFacturas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando', err);
          this.errorMsg = `Error creando factura: ${err.status}`;
        }
      });
    }
  }

  // 🔹 ELIMINAR FACTURA
  deleteFactura(id_factura: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta factura?')) return;

    this.facturasService.delete(id_factura).subscribe({
      next: () => this.loadFacturas(),
      error: (err) => {
        console.error('Error eliminando factura', err);
        this.errorMsg = `Error eliminando factura: ${err.status}`;
      }
    });
  }

  // ⭐⭐⭐ NUEVO: ENVIAR A DIAN (SIMULADO)
  enviarDian(factura: any): void {
    if (!confirm('¿Enviar esta factura a la DIAN (modo demo)?')) return;

    this.facturasService.enviarDian(factura.id_factura).subscribe({
      next: (resp) => {
        console.log('Respuesta DIAN =>', resp);
        alert('Factura enviada a DIAN: ' + resp.resultado.estado);
        this.loadFacturas();
      },
      error: (err) => {
        console.error('Error enviando a DIAN', err);
        alert('Error enviando factura a la DIAN');
      }
    });
  }

  // EXPORTACIONES
  exportPdf(id_factura: number): void {
    window.open(`http://127.0.0.1:8000/api/facturas/${id_factura}/pdf`, '_blank');
  }

  exportExcel(id_factura: number): void {
    window.open(`http://127.0.0.1:8000/api/facturas/${id_factura}/excel`, '_blank');
  }
}
