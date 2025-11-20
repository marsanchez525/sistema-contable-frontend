import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsientosContablesService } from '../../../services/asientos-contables.service';

@Component({
  selector: 'app-asientos-contables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asientos-contables.component.html',
  styleUrls: ['./asientos-contables.component.scss']
})
export class AsientosContablesComponent implements OnInit {

  asientos: any[] = [];
  showModal = false;

  asientoForm = {
    id: null,
    Fecha_Asiento: '',
    Descripcion_Asiento: '',
    Debe: '',
    Haber: ''
  };

  constructor(private asientosService: AsientosContablesService) {}

  ngOnInit(): void {
    this.loadAsientos();
  }

  loadAsientos() {
    this.asientosService.getAll().subscribe(data => {
      this.asientos = data;
    });
  }

  openModal(asiento: any = null) {
    if (asiento) {
      this.asientoForm = { ...asiento };
    } else {
      this.asientoForm = {
        id: null,
        Fecha_Asiento: '',
        Descripcion_Asiento: '',
        Debe: '',
        Haber: ''
      };
    }
    this.showModal = true;
  }

  saveAsiento() {
    if (this.asientoForm.id) {
      this.asientosService.update(this.asientoForm.id, this.asientoForm)
        .subscribe(() => this.loadAsientos());
    } else {
      this.asientosService.create(this.asientoForm)
        .subscribe(() => this.loadAsientos());
    }
    this.showModal = false;
  }

  deleteAsiento(id: number) {
    if (confirm('¿Eliminar este asiento contable?')) {
      this.asientosService.delete(id).subscribe(() => this.loadAsientos());
    }
  }
}
