import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

const STATUS_CLASS_MAP: Record<string, string> = {
  Borrador: 'status-chip--pending',
  Recolectada: 'status-chip--progress',
  Procesada: 'status-chip--progress',
  Facturada: 'status-chip--success',
  Emitida: 'status-chip--pending',
  'Pago Parcial': 'status-chip--progress',
  Pagado: 'status-chip--success',
  Vencido: 'status-chip--danger',
  Cancelado: 'status-chip--danger',
  Anulado: 'status-chip--danger',
  Anulada: 'status-chip--danger'
};

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './status-chip.html',
  styleUrl: './status-chip.scss'
})
export class StatusChip {
  @Input() status = '';

  get cssClass(): string {
    return STATUS_CLASS_MAP[this.status] ?? 'status-chip--default';
  }
}
