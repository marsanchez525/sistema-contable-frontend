import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineasAsientoService } from '../../../services/lineas-asiento.service';

@Component({
  selector: 'app-lineas-asiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineas-asiento.component.html',
  styleUrls: ['./lineas-asiento.component.scss']
})
export class LineasAsientoComponent implements OnInit {

  lineas: any[] = [];
  showModal = false;

  lineaForm = {
    id: null,
    Id_Asiento: '',
    Cuenta: '',
    Debe: '',
    Haber: ''
  };

  constructor(private lineasService: LineasAsientoService) {}

  ngOnInit(): void {
    this.loadLineas();
  }

  loadLineas() {
    this.lineasService.getAll().subscribe(data => {
      this.lineas = data;
    });
  }

  openModal(linea: any = null) {
    if (linea) {
      this.lineaForm = { ...linea };
    } else {
      this.lineaForm = {
        id: null,
        Id_Asiento: '',
        Cuenta: '',
        Debe: '',
        Haber: ''
      };
    }
    this.showModal = true;
  }

  saveLinea() {
    if (this.lineaForm.id) {
      this.lineasService.update(this.lineaForm.id, this.lineaForm)
        .subscribe(() => this.loadLineas());
    } else {
      this.lineasService.create(this.lineaForm)
        .subscribe(() => this.loadLineas());
    }

    this.showModal = false;
  }

  deleteLinea(id: number) {
    if (confirm('¿Eliminar esta línea de asiento?')) {
      this.lineasService.delete(id).subscribe(() => this.loadLineas());
    }
  }
}
