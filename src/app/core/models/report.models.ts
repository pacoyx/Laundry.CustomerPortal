export interface MonthlySummaryReport {
  period: string;
  totalGuides: number;
  totalWeight: number;
  totalAmount: number;
  invoicesThisMonth: number;
}

export interface HistoryReportItem {
  period: string;
  totalGuides: number;
  totalWeight: number;
  totalAmount: number;
}

export interface HistoryReportApiItem {
  year: number;
  month: number;
  guideCount: number;
  totalWeight: number;
  totalAmount: number;
}

export interface ByServiceReportItem {
  serviceName: string;
  quantity: number;
  weight: number;
  amount: number;
}

export interface ByServiceReportApiItem {
  serviceItemId: number;
  serviceItemName: string;
  guideCount: number;
  totalQuantity: number;
  totalWeight: number;
  totalAmount: number;
}
