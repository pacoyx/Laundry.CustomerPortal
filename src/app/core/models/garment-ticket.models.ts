export type GarmentTicketStatus = 'Pendiente' | 'Recogido' | 'Anulado';

export const GARMENT_TICKET_STATUS_LABELS: Record<number, GarmentTicketStatus> = {
  1: 'Pendiente',
  2: 'Recogido',
  3: 'Anulado'
};

export const GARMENT_TICKET_STATUS_VALUES: Record<GarmentTicketStatus, number> = {
  Pendiente: 1,
  Recogido: 2,
  Anulado: 3
};

export interface GarmentTicketServiceItemLookupApi {
  serviceItemId: number;
  name: string;
}

export interface GarmentTicketDetailRequest {
  workerId: number;
  serviceItemId: number;
  quantity: number;
  observations: string | null;
}

export interface CreateGarmentTicketRequest {
  details: GarmentTicketDetailRequest[];
}

export interface GarmentTicketDetailLineApi {
  id: number;
  workerId: number;
  workerName: string;
  serviceItemId: number;
  serviceItemName: string;
  quantity: number;
  observations: string | null;
}

export interface GarmentTicketPhotoApi {
  id: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export interface GarmentTicketApi {
  id: number;
  ticketNumber: string;
  status: number;
  created: string;
  createdByUserName: string;
  voidedReason: string | null;
  voidedAt: string | null;
  voidedByUserName: string | null;
  pickupGuideId: number | null;
  pickedUpAt: string | null;
  details: GarmentTicketDetailLineApi[];
  photos: GarmentTicketPhotoApi[];
}

export interface GarmentTicketSummaryApi {
  id: number;
  ticketNumber: string;
  status: number;
  created: string;
  totalQuantity: number;
  lineCount: number;
}

export interface GarmentTicketListItem {
  id: number;
  ticketNumber: string;
  status: GarmentTicketStatus;
  created: string;
  totalQuantity: number;
  lineCount: number;
}

export interface GarmentTicketDetail {
  id: number;
  ticketNumber: string;
  status: GarmentTicketStatus;
  created: string;
  createdByUserName: string;
  voidedReason: string | null;
  voidedAt: string | null;
  voidedByUserName: string | null;
  pickedUpAt: string | null;
  lines: GarmentTicketDetailLineApi[];
  photos: GarmentTicketPhotoApi[];
}

export interface GarmentTicketPendingSummaryItemApi {
  serviceItemId: number;
  serviceItemName: string;
  totalQuantity: number;
}

export interface GarmentTicketFilter {
  status?: number | '';
  ticketNumber?: string;
}
