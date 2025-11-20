import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../../services/roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  roles: any[] = [];
  showModal = false;

  rolForm = {
    id_rol: null,
    nombre: '',
    descripcion: ''
  };

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.rolesService.getAll().subscribe({
      next: (resp: any) => {
        this.roles = resp;
      },
      error: (err) => console.error("Error cargando roles", err)
    });
  }

  openModal(rol: any = null) {
    if (rol) {
      this.rolForm = {
        id_rol: rol.id_rol,
        nombre: rol.nombre,
        descripcion: rol.descripcion
      };
    } else {
      this.rolForm = {
        id_rol: null,
        nombre: '',
        descripcion: ''
      };
    }
    this.showModal = true;
  }

  saveRol() {
    const data = {
      nombre: this.rolForm.nombre,
      descripcion: this.rolForm.descripcion
    };

    if (this.rolForm.id_rol) {
      this.rolesService.update(this.rolForm.id_rol, data).subscribe(() => {
        this.loadRoles();
        this.showModal = false;
      });
    } else {
      this.rolesService.create(data).subscribe(() => {
        this.loadRoles();
        this.showModal = false;
      });
    }
  }

  deleteRol(id_rol: number) {
    if (!confirm("¿Eliminar este rol?")) return;

    this.rolesService.delete(id_rol).subscribe(() => this.loadRoles());
  }
}
