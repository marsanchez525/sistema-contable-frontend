import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  loading = false;
  errorMsg = '';
  showModal = false;

  usuarioForm = {
    id_usuario: null as number | null,
    nombre: '',
    email: '',
    rol: '',
    estado: ''
  };

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.errorMsg = '';

    this.usuariosService.getAll().subscribe({
      next: (resp) => {
        console.log('GET /usuarios =>', resp);

        if (Array.isArray(resp)) {
          this.usuarios = resp;
        } else if (resp.data && Array.isArray(resp.data)) {
          this.usuarios = resp.data;
        } else if (resp.usuarios && Array.isArray(resp.usuarios)) {
          this.usuarios = resp.usuarios;
        } else {
          this.usuarios = [];
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
        this.errorMsg = `Error cargando usuarios: ${err.status} ${err.statusText || ''}`;
        this.loading = false;
      }
    });
  }

  openModal(usuario: any = null): void {
    if (usuario) {
      this.usuarioForm = {
        id_usuario: usuario.id_usuario ?? null,
        nombre: usuario.nombre ?? '',
        email: usuario.email ?? '',
        rol: usuario.rol ?? '',
        estado: usuario.estado ?? ''
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
    this.usuarioForm = {
      id_usuario: null,
      nombre: '',
      email: '',
      rol: '',
      estado: ''
    };
  }

  saveUsuario(): void {
    this.errorMsg = '';

    const payload = {
      nombre: this.usuarioForm.nombre,
      email: this.usuarioForm.email,
      rol: this.usuarioForm.rol,
      estado: this.usuarioForm.estado
    };

    console.log('Guardando usuario =>', payload);

    if (this.usuarioForm.id_usuario) {
      // EDITAR
      this.usuariosService.update(this.usuarioForm.id_usuario, payload).subscribe({
        next: (resp) => {
          console.log('PUT /usuarios OK', resp);
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error actualizando usuario', err);
          this.errorMsg = `Error actualizando usuario: ${err.status} ${err.statusText || ''}`;
        }
      });
    } else {
      // CREAR
      this.usuariosService.create(payload).subscribe({
        next: (resp) => {
          console.log('POST /usuarios OK', resp);
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creando usuario', err);
          this.errorMsg = `Error creando usuario: ${err.status} ${err.statusText || ''}`;
        }
      });
    }
  }

  deleteUsuario(id_usuario: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.errorMsg = '';
    this.usuariosService.delete(id_usuario).subscribe({
      next: (resp) => {
        console.log('DELETE /usuarios OK', resp);
        this.loadUsuarios();
      },
      error: (err) => {
        console.error('Error eliminando usuario', err);
        this.errorMsg = `Error eliminando usuario: ${err.status} ${err.statusText || ''}`;
      }
    });
  }
}
