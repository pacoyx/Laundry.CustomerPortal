export interface CompanyWorkerApi {
  id: number;
  code: string;
  fullName: string;
  area: string;
  isActive: boolean;
}

export interface CompanyWorkerListItem {
  id: number;
  code: string;
  fullName: string;
  area: string;
  active: boolean;
}

export interface CompanyWorkerRequest {
  code: string;
  fullName: string;
  area: string;
}
