import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetallesFacturaService } from '../../../services/detalles-factura.service';

interface DetalleForm {
  id_detalle: number | null;
  id_factura: number | null;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
}

@Component({
  selector: 'app-detalles-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles-factura.component.html',
  styleUrls: ['./detalles-factura.component.scss']
})
export class DetallesFacturaComponent implements OnChanges {

  @Input() id_factura!: number;   // lo trae el padre

  detalles: any[] = [];
  showModal = false;

  detalleForm: DetalleForm = {
    id_detalle: null,
    id_factura: null,
    descripcion: '',
    cantidad: 1,
    precio_unitario: 0
  };

  constructor(private detallesService: DetallesFacturaService) {}

  // Se ejecuta cuando cambia el @Input()
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id_factura'] && changes['id_factura'].currentValue) {
      this.detalleForm.id_factura = changes['id_factura'].currentValue;
      this.loadDetalles();
    }
  }

  loadDetalles() {
    if (!this.id_factura) {
      console.warn('id_factura no definido en DetallesFacturaComponent');
      return;
    }

    this.detallesService.getByFactura(this.id_factura).subscribe({
      next: d => this.detalles = d,
      error: err => console.error('Error cargando detalles', err)
    });
  }

  openModal(detalle: any = null) {
    if (detalle) {
      this.detalleForm = {
        id_detalle: detalle.id_detalle ?? null,
        id_factura: detalle.id_factura ?? this.id_factura,
        descripcion: detalle.descripcion ?? '',
        cantidad: Number(detalle.cantidad ?? 1),
        precio_unitario: Number(detalle.precio_unitario ?? 0),
      };
    } else {
      this.detalleForm = {
        id_detalle: null,
        id_factura: this.id_factura ?? null,
        descripcion: '',
        cantidad: 1,
        precio_unitario: 0
      };
    }
    this.showModal = true;
  }

  saveDetalle() {
    if (!this.id_factura) {
      console.error('No hay id_factura para guardar detalle');
      return;
    }

    const payload = {
      id_factura: this.id_factura,
      descripcion: this.detalleForm.descripcion,
      cantidad: Number(this.detalleForm.cantidad),
      precio_unitario: Number(this.detalleForm.precio_unitario)
    };

    if (this.detalleForm.id_detalle) {
      this.detallesService.update(this.detalleForm.id_detalle, payload)
        .subscribe(() => {
          this.loadDetalles();
          this.closeModal();
        });
    } else {
      this.detallesService.create(payload)
        .subscribe(() => {
          this.loadDetalles();
          this.closeModal();
        });
    }
  }

  deleteDetalle(id_detalle: number) {
    if (confirm('¿Eliminar este ítem?')) {
      this.detallesService.delete(id_detalle).subscribe(() => this.loadDetalles());
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
