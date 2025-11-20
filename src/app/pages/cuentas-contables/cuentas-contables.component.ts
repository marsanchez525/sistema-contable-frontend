import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentasContablesService } from '../../../services/cuentas-contables.service';

interface CuentaForm {
  id_cuenta: number | null;
  codigo: string;
  nombre: string;
  tipo: string;
  saldo_inicial: number | null;
}

@Component({
  selector: 'app-cuentas-contables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuentas-contables.component.html',
  styleUrls: ['./cuentas-contables.component.scss']
})
export class CuentasContablesComponent implements OnInit {

  cuentas: any[] = [];
  showModal = false;
  errorMsg = '';

  cuentaForm: CuentaForm = {
    id_cuenta: null,
    codigo: '',
    nombre: '',
    tipo: '',
    saldo_inicial: null
  };

  constructor(private cuentasService: CuentasContablesService) {}

  ngOnInit(): void {
    this.loadCuentas();
  }

  loadCuentas(): void {
    this.errorMsg = '';
    this.cuentasService.getAll().subscribe({
      next: data => {
        this.cuentas = data;
      },
      error: err => {
        console.error('Error cargando cuentas contables', err);
        this.errorMsg = 'Error cargando cuentas contables';
      }
    });
  }

  openModal(cuenta: any = null): void {
    if (cuenta) {
      this.cuentaForm = {
        id_cuenta: cuenta.id_cuenta ?? cuenta.id ?? null,
        codigo: cuenta.codigo ?? '',
        nombre: cuenta.nombre ?? cuenta.nombre_cuenta ?? '',
        tipo: cuenta.tipo ?? '',
        saldo_inicial: cuenta.saldo_inicial ?? 0
      };
    } else {
      this.cuentaForm = {
        id_cuenta: null,
        codigo: '',
        nombre: '',
        tipo: '',
        saldo_inicial: null
      };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCuenta(): void {
    this.errorMsg = '';

    const payload = {
      codigo: this.cuentaForm.codigo,
      nombre: this.cuentaForm.nombre,
      tipo: this.cuentaForm.tipo,
      saldo_inicial: this.cuentaForm.saldo_inicial ?? 0
    };

    if (this.cuentaForm.id_cuenta) {
      this.cuentasService.update(this.cuentaForm.id_cuenta, payload).subscribe({
        next: () => {
          this.loadCuentas();
          this.closeModal();
        },
        error: err => {
          console.error('Error actualizando cuenta contable', err);
          this.errorMsg = 'Error actualizando cuenta contable';
        }
      });
    } else {
      this.cuentasService.create(payload).subscribe({
        next: () => {
          this.loadCuentas();
          this.closeModal();
        },
        error: err => {
          console.error('Error creando cuenta contable', err);
          this.errorMsg = 'Error creando cuenta contable';
        }
      });
    }
  }

  deleteCuenta(id: number): void {
    if (!confirm('¿Eliminar esta cuenta contable?')) return;

    this.cuentasService.delete(id).subscribe({
      next: () => this.loadCuentas(),
      error: err => console.error('Error eliminando cuenta contable', err)
    });
  }
}
