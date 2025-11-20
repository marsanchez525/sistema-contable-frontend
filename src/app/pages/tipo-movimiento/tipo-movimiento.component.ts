import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoMovimientoService } from '../../../services/tipo-movimiento.service';

@Component({
  selector: 'app-tipo-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-movimiento.component.html',
  styleUrls: ['./tipo-movimiento.component.scss']
})
export class TipoMovimientoComponent implements OnInit {

  tipos: any[] = [];
  showModal = false;

  tipoForm = {
    id_tipo: null,
    nombre: ''
  };

  constructor(private tipoService: TipoMovimientoService) {}

  ngOnInit(): void {
    this.loadTipos();
  }

  loadTipos() {
    this.tipoService.getAll().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error(err)
    });
  }

  openModal(tipo: any = null) {
    if (tipo) {
      this.tipoForm = { id_tipo: tipo.id_tipo ?? tipo.id ?? null, nombre: tipo.nombre ?? tipo.Nombre ?? '' };
    } else {
      this.tipoForm = { id_tipo: null, nombre: '' };
    }
    this.showModal = true;
  }

  save() {
    const payload = { nombre: this.tipoForm.nombre };

    if (this.tipoForm.id_tipo) {
      this.tipoService.update(this.tipoForm.id_tipo, payload).subscribe({
        next: () => { this.loadTipos(); this.closeModal(); },
        error: err => console.error(err)
      });
    } else {
      this.tipoService.create(payload).subscribe({
        next: () => { this.loadTipos(); this.closeModal(); },
        error: err => console.error(err)
      });
    }
  }

  delete(id: number) {
    if (!confirm('¿Eliminar este tipo de movimiento?')) return;
    this.tipoService.delete(id).subscribe({
      next: () => this.loadTipos(),
      error: err => console.error(err)
    });
  }

  closeModal() {
    this.showModal = false;
    this.tipoForm = { id_tipo: null, nombre: '' };
  }
}
