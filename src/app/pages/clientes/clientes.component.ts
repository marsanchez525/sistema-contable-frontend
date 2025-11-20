import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../services/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  showModal = false;
  loading = false;

  clienteForm = {
    id_cliente: null as number | null,
    nombre: '',
    nit: '',
    telefono: '',
    direccion: '',
    correo: ''
  };

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.loadClientes();
  }

  // CARGAR LISTA DESDE EL BACKEND
  loadClientes(): void {
    this.loading = true;
    this.clientesService.getAll().subscribe({
      next: (resp) => {
        console.log('Respuesta GET /clientes:', resp);

        // Soporta: [ ... ]  o  {data: [...] }  o  {clientes: [...]}
        if (Array.isArray(resp)) {
          this.clientes = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.clientes = resp.data;
        } else if (resp.clientes && Array.isArray(resp.clientes)) {
          this.clientes = resp.clientes;
        } else {
          this.clientes = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando clientes', err);
        this.loading = false;
      }
    });
  }

  openModal(cliente: any = null): void {
    if (cliente) {
      this.clienteForm = {
        id_cliente: cliente.id_cliente ?? null,
        nombre: cliente.nombre ?? '',
        nit: cliente.nit ?? '',
        telefono: cliente.telefono ?? '',
        direccion: cliente.direccion ?? '',
        correo: cliente.correo ?? ''
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
    this.clienteForm = {
      id_cliente: null,
      nombre: '',
      nit: '',
      telefono: '',
      direccion: '',
      correo: ''
    };
  }

  // GUARDAR (CREAR O EDITAR)
  saveCliente(): void {
    const payload = {
      nombre: this.clienteForm.nombre,
      nit: this.clienteForm.nit,
      telefono: this.clienteForm.telefono,
      direccion: this.clienteForm.direccion,
      correo: this.clienteForm.correo
    };

    console.log('Enviando payload a backend:', payload);

    if (this.clienteForm.id_cliente) {
      // EDITAR
      this.clientesService.update(this.clienteForm.id_cliente, payload).subscribe({
        next: (resp) => {
          console.log('Respuesta PUT /clientes:', resp);
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => console.error('Error actualizando cliente', err)
      });
    } else {
      // CREAR
      this.clientesService.create(payload).subscribe({
        next: (resp) => {
          console.log('Respuesta POST /clientes:', resp);
          this.loadClientes();
          this.closeModal();
        },
        error: (err) => console.error('Error creando cliente', err)
      });
    }
  }

  deleteCliente(id_cliente: number): void {
    if (!confirm('¿Eliminar este cliente?')) return;

    this.clientesService.delete(id_cliente).subscribe({
      next: (resp) => {
        console.log('Respuesta DELETE /clientes:', resp);
        this.loadClientes();
      },
      error: (err) => console.error('Error eliminando cliente', err)
    });
  }
}
