import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss'
})
export class KpiCard {
  @Input() label = '';
  @Input() value: string | number | null = '';
  @Input() icon = 'insights';
  @Input() accent: 'indigo' | 'blue' | 'gray' = 'indigo';
}
