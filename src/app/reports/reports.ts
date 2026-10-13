import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportsByService } from './by-service/by-service';
import { ReportsHistory } from './history/history';
import { ReportsSummary } from './summary/summary';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatTabsModule, ReportsSummary, ReportsHistory, ReportsByService],
  templateUrl: './reports.html'
})
export class Reports {}
