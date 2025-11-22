import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AsientosContablesService } from '../../../services/asientos-contables.service';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-asientos-contables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asientos-contables.component.html',
  styleUrls: ['./asientos-contables.component.scss']
})
export class AsientosContablesComponent implements OnInit {

  asientos: any[] = [];
  usuarios: any[] = [];

  showModal = false;

  asientoForm = {
    id_asiento: null as number | null,
    fecha: '',
    descripcion: '',
    creado_por: null as number | null,
    modificado_por: null as number | null
  };

  constructor(
    private asientosService: AsientosContablesService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.asientosService.getAll().subscribe({
      next: data => this.asientos = data,
      error: err => console.error('Error cargando asientos', err)
    });

    this.usuariosService.getAll().subscribe({
      next: data => this.usuarios = data,
      error: err => console.error('Error cargando usuarios', err)
    });
  }

  openModal(asiento: any = null): void {
    if (asiento) {
      this.asientoForm = {
        id_asiento: asiento.id_asiento ?? asiento.id ?? null,
        fecha: asiento.fecha?.substring(0, 10) ?? '',
        descripcion: asiento.descripcion ?? '',
        creado_por: asiento.creado_por ?? null,
        modificado_por: asiento.modificado_por ?? null
      };
    } else {
      this.asientoForm = {
        id_asiento: null,
        fecha: new Date().toISOString().substring(0, 10),
        descripcion: '',
        creado_por: null,
        modificado_por: null
      };
    }
    this.showModal = true;
  }

  save(): void {
    const payload = {
      fecha: this.asientoForm.fecha,
      descripcion: this.asientoForm.descripcion,
      creado_por: this.asientoForm.creado_por,
      modificado_por: this.asientoForm.modificado_por
    };

    console.log('Payload asiento:', payload);

    if (this.asientoForm.id_asiento) {
      this.asientosService.update(this.asientoForm.id_asiento, payload).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: err => console.error('Error actualizando asiento', err)
      });
    } else {
      this.asientosService.create(payload).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
        },
        error: err => console.error('Error creando asiento', err)
      });
    }
  }

  delete(id: number): void {
    if (!confirm('¿Eliminar este asiento contable?')) return;

    this.asientosService.delete(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Error eliminando asiento', err)
    });
  }

  closeModal(): void {
    this.showModal = false;
  }
}
