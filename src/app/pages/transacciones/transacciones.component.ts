import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TransaccionesService } from '../../../services/transacciones.service';
import { ClientesService } from '../../../services/clientes.service';
import { ProveedoresService } from '../../../services/proveedores.service';
import { CuentasContablesService } from '../../../services/cuentas-contables.service';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})
export class TransaccionesComponent implements OnInit {

  transacciones: any[] = [];

  clientes: any[] = [];
  proveedores: any[] = [];
  cuentas: any[] = [];

  showModal = false;

  transaccionForm = {
    id_transaccion: null,
    id_cuenta: null,
    id_cliente: null,
    id_proveedor: null,
    descripcion: '',
    monto: 0,
    fecha: '',
    tipo: 'egreso'
  };

  constructor(
    private transaccionesService: TransaccionesService,
    private clientesService: ClientesService,
    private proveedoresService: ProveedoresService,
    private cuentasService: CuentasContablesService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.transaccionesService.getAll().subscribe(t => this.transacciones = t);
    this.clientesService.getAll().subscribe(c => this.clientes = c);
    this.proveedoresService.getAll().subscribe(p => this.proveedores = p);
    this.cuentasService.getAll().subscribe(cta => this.cuentas = cta);
  }

  openModal(data: any = null) {
    if (data) {
      this.transaccionForm = { ...data };
    } else {
      this.transaccionForm = {
        id_transaccion: null,
        id_cuenta: null,
        id_cliente: null,
        id_proveedor: null,
        descripcion: '',
        monto: 0,
        fecha: '',
        tipo: 'egreso'
      };
    }
    this.showModal = true;
  }

  save() {
    if (this.transaccionForm.id_transaccion) {
      this.transaccionesService.update(
        this.transaccionForm.id_transaccion,
        this.transaccionForm
      ).subscribe(() => {
        this.loadAllData();
        this.showModal = false;
      });

    } else {
      this.transaccionesService.create(this.transaccionForm)
        .subscribe(() => {
          this.loadAllData();
          this.showModal = false;
        });
    }
  }

  delete(id: number) {
    if (!confirm('¿Eliminar transacción?')) return;

    this.transaccionesService.delete(id).subscribe(() => {
      this.loadAllData();
    });
  }
}
