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

  /**
   * Auditoria de aliado por pais
   * @param country seleccionado en filtros
   * @returns auditoria de aliado
   */
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

  /**
   * Auditoria configuracion aliado y compania
   * @param allyId id de aliado seleccionado en filtros
   * @returns configuraciones de aliados con companias filtrado por el id de aliado
   */
  getAuditConfigAllyCompanyByAlly(allyId) {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/allies/` + allyId).pipe(
      map((data) => data))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }
  /**
   * Auditoria configuracion aliado y compania
   * @param allyId  id de aliado seleccionado en filtros
   * @param companyId id de compania seleccionado en filtros
   * @returns configuraciones de aliados con companias filtrado por el id de aliado y por el id de compania
   */
  getAuditConfigAllyCompanyByAllyAndCompany(allyId, companyId) {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/` + companyId + '/allies/' + allyId).pipe(
      map((data) => data))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }
  /**
   * Auditoria configuracion aliado y compania
   * @returns todas las configuraciones de aliados con companias 
   */
  getAllAllyCompanyConfig() {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/`).pipe(
      map((data) => data))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  /**
   * Crear auditoria de aliado
   * @param audit objeto de auditoria 
   */
  createAuditAlly(audit) {
    return this.http.post(`${environment.apiUrl}/allies/audits`, audit);
  }

  /**
   * Crear auditoria de configuracion de alianza
   * @param configAllyCompanyAudit 
   */
  creatAllyCompanyConfig(configAllyCompanyAudit){
    return this.http.post(`${environment.apiUrl}/audits/configurations/companies`, configAllyCompanyAudit);
  }


}
