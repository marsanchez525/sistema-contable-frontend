import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadosService } from '../../../services/estados.service';

@Component({
  selector: 'app-estados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estados.component.html',
  styleUrls: ['./estados.component.scss']
})
export class EstadosComponent implements OnInit {

  estados: any[] = [];
  showModal = false;

  estadoForm = {
    id_estado: null,
    nombre: ''
  };

  constructor(private estadosService: EstadosService) {}

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados() {
    this.estadosService.getAll().subscribe({
      next: data => this.estados = data,
      error: err => console.error(err)
    });
  }

  openModal(estado: any = null) {
    if (estado) {
      this.estadoForm = {
        id_estado: estado.id_estado ?? estado.id ?? null,
        nombre: estado.nombre ?? estado.Nombre ?? ''
      };
    } else {
      this.estadoForm = { id_estado: null, nombre: '' };
    }
    this.showModal = true;
  }

  save() {
    const payload = { nombre: this.estadoForm.nombre };

    if (this.estadoForm.id_estado) {
      this.estadosService.update(this.estadoForm.id_estado, payload).subscribe({
        next: () => { this.loadEstados(); this.closeModal(); },
        error: err => console.error(err)
      });
    } else {
      this.estadosService.create(payload).subscribe({
        next: () => { this.loadEstados(); this.closeModal(); },
        error: err => console.error(err)
      });
    }
  }

  delete(id: number) {
    if (!confirm('¿Eliminar este estado?')) return;

    this.estadosService.delete(id).subscribe({
      next: () => this.loadEstados(),
      error: err => console.error(err)
    });
  }

  closeModal() {
    this.showModal = false;
    this.estadoForm = { id_estado: null, nombre: '' };
  }
}
