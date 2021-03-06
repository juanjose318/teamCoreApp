import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
// import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private auditListener = new Subject<{ audit: any[] }>();
  private audit: any;
  private _refresh$ = new Subject<void>();


  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
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
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  get refresh$() {
    return this._refresh$;
  }


  getAllAlliesAudits() {
    return this.http.get(`${environment.apiUrl}/allies/audits`).pipe(
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  getAuditsByCompany(idCompany) {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/` + idCompany).pipe(
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
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
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
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
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  getConfigAuditsByCountry(country) {
    if (!country) {
      return;
    } else {
      return this.http.get(`${environment.apiUrl}/audits/configurations/companies/countries/` + country).pipe(
        map((data) => data), catchError(err => {
          this.showErrorMessage('No se pudo obtener auditoria');
          return throwError(err);
        }))
        .subscribe((data => {
          this.audit = data;
          this.auditListener.next({
            audit: this.audit
          });
        }
        ));
    }
  }

  getAllAudits() {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/`).pipe(
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
      .subscribe((data => {
        this.audit = data;
        this.auditListener.next({
          audit: this.audit
        });
      }
      ));
  }

  /**
   * Mostrar Mensaje de error
   */
  showErrorMessage(message) {
    this._snackBar.open(message, 'cerrar', {
      duration: 2000,
    });
  }

  /**
   * Auditoria configuracion aliado y compania
   * @returns todas las configuraciones de aliados con companias
   */
  getAllAllyCompanyConfig() {
    return this.http.get(`${environment.apiUrl}/audits/configurations/companies/`).pipe(
      map((data) => data), catchError(err => {
        this.showErrorMessage('No se pudo obtener auditoria');
        return throwError(err);
      }))
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
    return this.http.post(`${environment.apiUrl}/allies/audits`, audit).pipe(
      tap(() => this._refresh$.next()),
      catchError(err => {
        this.showErrorMessage('No se pudo crear auditoria');
        return throwError(err);
      })
    );
  }

  /**
   * Crear auditoria de traders
   * @param audit auditoria para enviar
   */
  createTraderAudit(audit) {
    return this.http.post(`${environment.apiUrl}/audits/configurations/traders`, audit).pipe(
      tap(() => this._refresh$.next()),
      catchError(err => {
        this.showErrorMessage('No se pudo crear auditoria');
        return throwError(err);
      })
    );
  }

  /**
   * Crear auditoria de configuracion de alianza
   */
  creatAllyCompanyConfig(configAllyCompanyAudit) {
    return this.http.post(`${environment.apiUrl}/audits/configurations/companies`, configAllyCompanyAudit).pipe(
      tap(() => this._refresh$.next()),
      catchError(err => {
        this.showErrorMessage('No se pudo crear auditoria');
        return throwError(err);
      })
    );
  }

}
