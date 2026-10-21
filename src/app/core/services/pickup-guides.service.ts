import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ATTACHMENT_TYPE_LABELS,
  PICKUP_GUIDE_STATUS_LABELS,
  PickupGuideAttachment,
  PickupGuideDetail,
  PickupGuideDetailLine,
  PickupGuideFilter,
  PickupGuideListItem,
  PickupGuideRevision,
  PortalPickupGuideAttachmentApi,
  PortalPickupGuideDetailApi,
  PortalPickupGuideRevisionApi,
  PortalPickupGuideSummaryApi
} from '../models/pickup-guide.models';

@Injectable({ providedIn: 'root' })
export class PickupGuidesService {
  constructor(private readonly http: HttpClient) {}

  list(filter: PickupGuideFilter): Observable<PickupGuideListItem[]> {
    let params = new HttpParams();
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.status) params = params.set('status', filter.status);

    return this.http.get<PortalPickupGuideSummaryApi[]>(`${environment.apiUrl}/pickup-guides`, { params }).pipe(
      map((items) =>
        items.map((item) => ({
          id: item.id,
          guideNumber: item.guideNumber,
          physicalGuideNumber: item.physicalGuideNumber,
          date: item.pickupDate,
          status: PICKUP_GUIDE_STATUS_LABELS[item.status] ?? 'Borrador',
          totalAmount: item.totalAmount,
          hasPdf: item.hasPdf,
          hasPhotos: item.hasPhotos,
          hasSignature: item.hasSignature,
          hasRevisions: item.hasRevisions
        }))
      )
    );
  }

  getById(id: number): Observable<PickupGuideDetail> {
    return this.http.get<PortalPickupGuideDetailApi>(`${environment.apiUrl}/pickup-guides/${id}`).pipe(
      map((detail) => {
        const lines: PickupGuideDetailLine[] = detail.details.map((line) => ({
          description: line.serviceItemName,
          quantity: line.quantity,
          weight: line.weight,
          unitPrice: line.unitPrice,
          amount: line.total,
          confirmedQuantity: line.confirmedQuantity
        }));

        return {
          id: detail.id,
          guideNumber: detail.guideNumber,
          physicalGuideNumber: detail.physicalGuideNumber,
          date: detail.pickupDate,
          status: PICKUP_GUIDE_STATUS_LABELS[detail.status] ?? 'Borrador',
          observation: detail.observation,
          totalWeight: lines.reduce((sum, line) => sum + (line.weight ?? 0), 0),
          totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
          totalAmount: detail.totalAmount,
          lines,
          employee: detail.employee ? { id: detail.employee.id, fullName: detail.employee.fullName } : null,
          vehicle: detail.vehicle
            ? { id: detail.vehicle.id, plate: detail.vehicle.plate, description: detail.vehicle.description }
            : null
        };
      })
    );
  }

  getAttachments(guideId: number): Observable<PickupGuideAttachment[]> {
    return this.http
      .get<PortalPickupGuideAttachmentApi[]>(`${environment.apiUrl}/pickup-guides/${guideId}/attachments`)
      .pipe(
        map((items) =>
          items.map((item) => ({
            id: item.id,
            attachmentType: item.attachmentType,
            typeLabel: ATTACHMENT_TYPE_LABELS[item.attachmentType] ?? 'Foto',
            originalFileName: item.originalFileName,
            contentType: item.contentType,
            fileSize: item.fileSize,
            createdAt: item.createdAt
          }))
        )
      );
  }

  getRevisions(guideId: number): Observable<PickupGuideRevision[]> {
    return this.http
      .get<PortalPickupGuideRevisionApi[]>(`${environment.apiUrl}/pickup-guides/${guideId}/revisions`)
      .pipe(
        map((items) =>
          items.map((item) => ({
            revisionDate: item.revisionDate,
            employeeName: item.employeeName,
            observation: item.observation,
            items: item.items.map((detail) => ({
              actionType: detail.actionType,
              serviceName: detail.serviceName,
              originalQuantity: detail.originalQuantity,
              newQuantity: detail.newQuantity,
              reason: detail.reason
            })),
            photos: item.photos.map((photo) => ({
              id: photo.id,
              originalFileName: photo.originalFileName,
              contentType: photo.contentType,
              fileSize: photo.fileSize,
              createdAt: photo.createdAt
            }))
          }))
        )
      );
  }

  downloadAttachment(attachmentId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/attachments/${attachmentId}/download`, { responseType: 'blob' });
  }

  downloadRevisionPhoto(photoId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/pickup-guides/revisions/photos/${photoId}/download`, {
      responseType: 'blob'
    });
  }
}
