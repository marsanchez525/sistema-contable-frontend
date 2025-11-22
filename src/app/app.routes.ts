import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './layouts/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { CuentasContablesComponent } from './pages/cuentas-contables/cuentas-contables.component';
import { AsientosContablesComponent } from './pages/asientos-contables/asientos-contables.component';
import { LineasAsientoComponent } from './pages/lineas-asiento/lineas-asiento.component';
import { TipoMovimientoComponent } from './pages/tipo-movimiento/tipo-movimiento.component';
import { TransaccionesComponent } from './pages/transacciones/transacciones.component';
import { EstadosComponent } from './pages/estados/estados.component';
import { FacturasComponent } from './pages/facturas/facturas.component';
import { DetallesFacturaComponent } from './pages/detalles-factura/detalles-factura.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

  // 🔐 Login fuera del layout
  { path: 'login', component: LoginComponent },

  // 🌐 Todo lo demás protegido por el guard
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'cuentas-contables', component: CuentasContablesComponent },
      { path: 'asientos-contables', component: AsientosContablesComponent },
      { path: 'lineas-asiento', component: LineasAsientoComponent },
      { path: 'tipo-movimiento', component: TipoMovimientoComponent },
      { path: 'transacciones', component: TransaccionesComponent },
      { path: 'estados', component: EstadosComponent },
      { path: 'facturas', component: FacturasComponent },
      { path: 'detalles-factura', component: DetallesFacturaComponent },
    ]
  },

  // Comodín
  { path: '**', redirectTo: 'login' }
];
