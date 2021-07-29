import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment.prod';
// import { environment } from 'src/environments/environment';


const httpOptionsForText = {
    headers: new HttpHeaders({
        'responseType': 'text'
    })
};

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private companyConfigListener = new Subject<{ companyConfig: any }>();
    private traderListener = new Subject<{ traders: any }>();
    private masterFileListener = new Subject<{ masterFiles: any }>();

    private companyConfig: any;
    private traders;
    private masterFiles;

    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar
    ) { }

    getAllyCompanyConfiguration(allyId) {
        if (!allyId) {
            return;
        }
        return this.http.get(`${environment.apiUrl}/configurations/companies/allies/` + allyId, httpOptions).subscribe((data) => {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        });
    }

    getAllyCompanyConfigurationByCompanyAndAlly(allyId, companyId) {
        if (!allyId || !companyId) {
            return;
        }
        return this.http.get(`${environment.apiUrl}/configurations/companies/` + companyId + '/allies/' + allyId, httpOptions).subscribe((data) => {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        });
    }

    getAllAllyCompanyConfig() {
        return this.http.get(`${environment.apiUrl}/configurations/companies/`, httpOptions).subscribe((data) => {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        });
    }

    activateOrDeactivateComercialRelation(relation) {
        const convertedRelation = JSON.stringify(relation);
        return this.http.put(`${environment.apiUrl}/configurations/companies`, convertedRelation, httpOptions);
    }

    getTradersSecondtTme(configId, companyCode) {
        if (!configId) {
            return;
        }
        this.http.get(`${environment.apiUrl}/configurations/traders/companies/` + companyCode + '/companiesconfig/' + configId).subscribe((data) => {
            this.traders = data;
            this.traderListener.next({
                traders: this.traders
            });
        });
    }

    getMasterFiles(idAlliedCompanyConfig) {
        return this.http
            .get<{ masterFiles: any[] }>(`${environment.apiUrl}/masters/configurations/` + idAlliedCompanyConfig, httpOptions)
            .pipe(
                map((data => data))
            ).subscribe((data) => {
                this.masterFiles = data;
                this.masterFileListener.next({
                    masterFiles: this.masterFiles
                });
            });
    }

    getLogMasterFile(masterParams) {
        return this.http
            .get(`${environment.apiUrl}/masters/downloads/routes/` + masterParams.idRoute + '/files/' + masterParams.fileName, { responseType: 'blob' as 'json' });
    }

    postMasterfile(masterfile) {
        const formatedmasterfile = JSON.stringify(masterfile);
        return this.http.post(`${environment.apiUrl}/masters/uploads`, formatedmasterfile, httpOptions).pipe(
            catchError(err => {
                this.showErrorMessage('No se pudo subir archivo masterfile');
                return throwError(err);
            })
        ); ;
    }

    postFirstConfiguration(configuration) {
        const formatedConfiguration = JSON.stringify(configuration);
        return this.http.post(`${environment.apiUrl}/configurations/companies`, formatedConfiguration, httpOptions)
            .pipe(
                catchError(err => {
                    this.showErrorMessage('No se pudo crear primera configuración');
                    return throwError(err);
                })
            );
    }

    postSecondConfiguration(configuration) {
        const formatedConfiguration = JSON.stringify(configuration);
        return this.http.post(`${environment.apiUrl}/configurations/traders`, formatedConfiguration, httpOptions)
            .pipe(
                catchError(err => {
                    this.showErrorMessage('No se pudo crear segunda configuración');
                    return throwError(err);
                })
            );
    }

    postThirdConfiguration(configuration) {
        const formatedConfiguration = JSON.stringify(configuration);
        return this.http.post(`${environment.apiUrl}/masters/`, formatedConfiguration, httpOptions).pipe(
            catchError(err => {
                this.showErrorMessage('No se pudo crear tercera configuración');
                return throwError(err);
            })
        );
    }

    showErrorMessage(message) {
        this._snackBar.open(message, 'cerrar', {
            duration: 2000,
        });
    }

    getTradersFirstTime(companyCode) {
        this.http.get(`${environment.apiUrl}/configurations/traders/companies/` + companyCode).subscribe((data) => {
            this.traders = data;
            this.traderListener.next({
                traders: this.traders
            });
        });
    }

    getMasterFileListener() {
        return this.masterFileListener.asObservable();
    }

    getAllyCompanyConfigListener() {
        return this.companyConfigListener.asObservable();
    }

    getTraderListener() {
        return this.traderListener.asObservable();
    }


}
