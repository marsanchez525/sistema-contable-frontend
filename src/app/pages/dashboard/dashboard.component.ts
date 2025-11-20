import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

// importa tus servicios reales
import { ClientesService } from '../../../services/clientes.service';
import { CuentasContablesService } from '../../../services/cuentas-contables.service';
import { FacturasService } from '../../../services/facturas.service';
import { TransaccionesService } from '../../../services/transacciones.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  totalClientes = 0;
  totalCuentas = 0;
  totalFacturas = 0;
  totalTransacciones = 0;

  // --------- GRÁFICA 1: Ingresos Mensuales ----------
  ingresosChartType: ChartType = 'bar';
  ingresosChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Ingresos' }
    ]
  };

  // --------- GRÁFICA 2: Movimientos por Cuenta ----------
  movimientosChartType: ChartType = 'bar';
  movimientosChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Movimientos' }
    ]
  };

  constructor(
    private clientesService: ClientesService,
    private CuentasContablesService: CuentasContablesService,
    private facturasService: FacturasService,
    private transaccionesService: TransaccionesService
  ) {}

  ngOnInit(): void {
    this.cargarTotales();
    this.cargarIngresosMensuales();
    this.cargarMovimientosPorCuenta();
  }

  private cargarTotales(): void {
    this.clientesService.getAll().subscribe({
      next: data => this.totalClientes = data.length,
      error: err => console.error('Error clientes', err)
    });

    this.CuentasContablesService.getAll().subscribe({
      next: data => this.totalCuentas = data.length,
      error: err => console.error('Error cuentas', err)
    });

    this.facturasService.getAll().subscribe({
      next: data => this.totalFacturas = data.length,
      error: err => console.error('Error facturas', err)
    });

    this.transaccionesService.getAll().subscribe({
      next: data => this.totalTransacciones = data.length,
      error: err => console.error('Error transacciones', err)
    });
  }

  private cargarIngresosMensuales(): void {
    this.facturasService.getAll().subscribe({
      next: facturas => {
        // 🔁 IMPORTANTE: limpiar primero para que no salga “infinito”
        const labels: string[] = [];
        const valores: number[] = [];

        // aquí solo es ejemplo: suma por mes
        const agrupado = new Map<string, number>();

        for (const f of facturas) {
          // ajusta al nombre real de tus campos
          const fecha = new Date(f.fecha || f.created_at);
          const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;

          const total = Number(f.total || f.valor || 0);

          agrupado.set(key, (agrupado.get(key) || 0) + total);
        }

        // pasamos el map a arrays
        agrupado.forEach((v, k) => {
          labels.push(k);
          valores.push(v);
        });

        this.ingresosChartData = {
          labels,
          datasets: [
            { data: valores, label: 'Ingresos' }
          ]
        };
      },
      error: err => console.error('Error ingresos mensuales', err)
    });
  }

  private cargarMovimientosPorCuenta(): void {
    this.transaccionesService.getAll().subscribe({
      next: transacciones => {
        const labels: string[] = [];
        const conteos: number[] = [];
        const agrupado = new Map<string, number>();

        for (const t of transacciones) {
          const cuenta = t.cuenta || t.cuenta_codigo || 'SIN CUENTA';
          agrupado.set(cuenta, (agrupado.get(cuenta) || 0) + 1);
        }

        agrupado.forEach((v, k) => {
          labels.push(k);
          conteos.push(v);
        });

        this.movimientosChartData = {
          labels,
          datasets: [
            { data: conteos, label: 'Movimientos' }
          ]
        };
      },
      error: err => console.error('Error movimientos', err)
    });
  }
}
