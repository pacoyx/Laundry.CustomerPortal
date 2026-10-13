export type InvoiceStatus = 'Borrador' | 'Emitida' | 'Pago Parcial' | 'Pagado' | 'Anulada';

export const INVOICE_STATUS_LABELS: Record<number, InvoiceStatus> = {
  1: 'Borrador',
  2: 'Emitida',
  3: 'Pago Parcial',
  4: 'Pagado',
  5: 'Anulada'
};

export interface InvoiceFilter {
  startDate?: string;
  endDate?: string;
  status?: InvoiceStatus | '';
}

export interface InvoiceListItem {
  id: number;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  amountPaid: number;
  balance: number;
  status: InvoiceStatus;
}

export interface InvoiceDetailLine {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceDetail {
  id: number;
  number: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  notes: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  balance: number;
  lines: InvoiceDetailLine[];
}

export interface InvoiceApiListItem {
  id: number;
  serie: string;
  numero: string;
  currencyId: string;
  issueDate: string;
  dueDate: string;
  total: number;
  amountPaid: number;
  balance: number;
  status: number;
}

export interface InvoiceApiDetailLine {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface InvoiceApiDetail {
  id: number;
  serie: string;
  numero: string;
  currencyId: string;
  issueDate: string;
  dueDate: string;
  subTotal: number;
  igv: number;
  total: number;
  amountPaid: number;
  balance: number;
  status: number;
  notes: string;
  details: InvoiceApiDetailLine[];
}
