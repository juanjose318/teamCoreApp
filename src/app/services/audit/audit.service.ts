import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditListener = new Subject<{ audit: any[] }>();
  private audit: any;

  constructor(
    private http: HttpClient,
  ) { }

  getAuditListener() {
    return this.auditListener.asObservable();
  }

  getAuditByCountry(country) {
    return this.http.get(`${environment.apiUrl}/allies/audits/countries/` + country).pipe(
      map((data) => data))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  createAuditAlly(audit) {
    return this.http.post(`${environment.apiUrl}/allies/audits`, audit);
  }

}
