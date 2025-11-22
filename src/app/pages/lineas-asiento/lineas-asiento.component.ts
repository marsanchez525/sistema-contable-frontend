import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LineasAsientoService } from '../../../services/lineas-asiento.service';
import { CuentasContablesService } from '../../../services/cuentas-contables.service';

@Component({
  selector: 'app-lineas-asiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineas-asiento.component.html',
  styleUrls: ['./lineas-asiento.component.scss']
})
export class LineasAsientoComponent implements OnInit {

  lineas: any[] = [];
  cuentas: any[] = [];

  showModal = false;

  lineaForm = {
    id_linea: null as number | null,
    id_asiento: null as number | null,
    id_cuenta: null as number | null,
    debe: 0,
    haber: 0
  };

  constructor(
    private lineasService: LineasAsientoService,
    private cuentasService: CuentasContablesService
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.lineasService.getAll().subscribe({
      next: data => this.lineas = data,
      error: err => console.error('Error cargando líneas de asiento', err)
    });

    this.cuentasService.getAll().subscribe({
      next: data => this.cuentas = data,
      error: err => console.error('Error cargando cuentas contables', err)
    });
  }

  openModal(linea: any = null): void {
    if (linea) {
      this.lineaForm = {
        id_linea: linea.id_linea ?? linea.id ?? null,
        id_asiento: linea.id_asiento ?? null,
        id_cuenta: linea.id_cuenta ?? null,
        debe: Number(linea.debe ?? 0),
        haber: Number(linea.haber ?? 0),
      };
    } else {
      this.lineaForm = {
        id_linea: null,
        id_asiento: null,
        id_cuenta: null,
        debe: 0,
        haber: 0
      };
    }
    this.showModal = true;
  }

  save(): void {
    const payload = {
      id_asiento: this.lineaForm.id_asiento,
      id_cuenta: this.lineaForm.id_cuenta,
      debe: this.lineaForm.debe,
      haber: this.lineaForm.haber
    };

    console.log('Payload línea asiento:', payload);

    if (this.lineaForm.id_linea) {
      this.lineasService.update(this.lineaForm.id_linea, payload).subscribe({
        next: () => {
          this.loadAll();
          this.closeModal();
        },
        error: err => console.error('Error actualizando línea de asiento', err)
      });
    } else {
      this.lineasService.create(payload).subscribe({
        next: () => {
          this.loadAll();
          this.closeModal();
        },
        error: err => console.error('Error creando línea de asiento', err)
      });
    }
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar esta línea de asiento?')) return;

    this.lineasService.delete(id).subscribe({
      next: () => this.loadAll(),
      error: err => console.error('Error eliminando línea de asiento', err)
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
