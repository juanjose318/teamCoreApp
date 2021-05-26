import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditListener = new Subject<{ audit: any[] }>();
  private audit: any;

  /**
   * TODO: Cambiar a variables de ambiente
   */
  private jsonAuditUrl = '../../assets/db/dbaudit.json';

  constructor(
    private http: HttpClient,

  ) { }

  getAuditListener() {
    return this.auditListener.asObservable();
  }

  getAudit() {
    return this.http.get(this.jsonAuditUrl)
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        })
      }
    ));
  }
}
