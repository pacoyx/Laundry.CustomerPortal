export type PickupGuideStatus = 'Borrador' | 'Recolectada' | 'Procesada' | 'Facturada' | 'Anulada';

export const PICKUP_GUIDE_STATUS_LABELS: Record<number, PickupGuideStatus> = {
  1: 'Borrador',
  2: 'Recolectada',
  3: 'Procesada',
  4: 'Facturada',
  5: 'Anulada'
};

export type PickupGuideAttachmentKind = 'Foto' | 'Firma' | 'PDF';

export const ATTACHMENT_TYPE_LABELS: Record<number, PickupGuideAttachmentKind> = {
  1: 'Foto',
  2: 'Firma',
  3: 'PDF'
};

export const ATTACHMENT_TYPE_ICONS: Record<number, string> = {
  1: 'photo_camera',
  2: 'draw',
  3: 'picture_as_pdf'
};

export const ATTACHMENT_TYPE_PHOTO = 1;
export const ATTACHMENT_TYPE_SIGNATURE = 2;
export const ATTACHMENT_TYPE_PDF = 3;

export interface PickupGuideFilter {
  startDate?: string;
  endDate?: string;
  status?: PickupGuideStatus | '';
}

export interface PickupGuideListItem {
  id: number;
  guideNumber: string;
  date: string;
  status: PickupGuideStatus;
  totalAmount: number;
  hasPdf: boolean;
  hasPhotos: boolean;
  hasSignature: boolean;
  hasRevisions: boolean;
}

export interface PickupGuideDetailLine {
  description: string;
  quantity: number;
  weight: number | null;
  unitPrice: number;
  amount: number;
  confirmedQuantity: number;
}

export interface PickupGuideEmployee {
  id: number;
  fullName: string;
}

export interface PickupGuideVehicle {
  id: number;
  plate: string;
  description: string;
}

export interface PickupGuideDetail {
  id: number;
  guideNumber: string;
  date: string;
  status: PickupGuideStatus;
  observation: string | null;
  totalWeight: number;
  totalQuantity: number;
  totalAmount: number;
  lines: PickupGuideDetailLine[];
  employee: PickupGuideEmployee | null;
  vehicle: PickupGuideVehicle | null;
}

export interface PickupGuideAttachment {
  id: number;
  attachmentType: number;
  typeLabel: PickupGuideAttachmentKind;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export type PickupGuideRevisionActionType = 'QuantityAdjustment' | 'AddedItem' | 'RemovedItem';

export const REVISION_ACTION_TYPE_LABELS: Record<PickupGuideRevisionActionType, string> = {
  QuantityAdjustment: 'Ajuste de cantidad',
  AddedItem: 'Ítem agregado',
  RemovedItem: 'Ítem eliminado'
};

export interface PickupGuideRevisionItem {
  actionType: PickupGuideRevisionActionType;
  serviceName: string;
  originalQuantity: number;
  newQuantity: number;
  reason: string;
}

export interface PickupGuideRevision {
  revisionDate: string;
  employeeName: string;
  observation: string;
  items: PickupGuideRevisionItem[];
}

// --- Contratos reales del backend (ver 24dex-backend-comercial/Features/CustomerPortal/PickupGuides) ---

export interface PortalPickupGuideSummaryApi {
  id: number;
  guideNumber: string;
  branchSalesId: number;
  pickupDate: string;
  status: number;
  totalAmount: number;
  createdAt: string;
  hasPdf: boolean;
  hasPhotos: boolean;
  hasSignature: boolean;
  hasRevisions: boolean;
}

export interface PortalEmployeeSummaryApi {
  id: number;
  fullName: string;
}

export interface PortalVehicleSummaryApi {
  id: number;
  plate: string;
  description: string;
}

export interface PortalPickupGuideDetailLineApi {
  id: number;
  serviceItemId: number;
  serviceItemName: string;
  quantity: number;
  weight: number | null;
  unitPrice: number;
  total: number;
  observation: string | null;
  originalQuantity: number;
  confirmedQuantity: number;
}

export interface PortalPickupGuideDetailApi {
  id: number;
  guideNumber: string;
  branchSalesId: number;
  pickupDate: string;
  status: number;
  observation: string | null;
  totalAmount: number;
  createdAt: string;
  details: PortalPickupGuideDetailLineApi[];
  employee: PortalEmployeeSummaryApi | null;
  vehicle: PortalVehicleSummaryApi | null;
}

export interface PortalPickupGuideAttachmentApi {
  id: number;
  attachmentType: number;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export interface PortalPickupGuideRevisionItemApi {
  actionType: PickupGuideRevisionActionType;
  serviceName: string;
  originalQuantity: number;
  newQuantity: number;
  reason: string;
}

export interface PortalPickupGuideRevisionApi {
  revisionDate: string;
  employeeName: string;
  observation: string;
  items: PortalPickupGuideRevisionItemApi[];
}
