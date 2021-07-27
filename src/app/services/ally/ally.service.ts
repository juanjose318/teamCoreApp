import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// import { environment } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class AliadoService {
    private allyListener = new Subject<{ allies: any }>();
    private ipListener = new Subject<{ ip: any }>();
    private allies: any;
    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar
    ) { }

    getAllies() {
        return this.http
            .get<{ allies: any[] }>(`${environment.apiUrl}/allies`)
            .pipe(
                map((data => data)),
                catchError(err => {
                    this.showErrorMessage('No se pudo obtener aliados');
                    return throwError(err);
                })
            ).subscribe((transformedData: any) => {
                this.allies = transformedData;
                this.allyListener.next({
                    allies: this.allies
                });
            });
    }

    createAlly(newAlly) {
        const convertedAlly = JSON.stringify(newAlly);
        return this.http.post(`${environment.apiUrl}/allies`, convertedAlly, httpOptions).pipe(
            catchError(err => {
                this.showErrorMessage('No se pudo crear aliado');
                return throwError(err);
            })
        );
    }

    getAllyListener() {
        return this.allyListener.asObservable();
    }

    getIpListener() {
        return this.ipListener.asObservable();
    }
    /**
     * @returns Ip de cliente
     */
    getIp() {
        return this.http
            .get(`${environment.apiUrl}/allies/ips`, { responseType: 'text' }).pipe(
                map((data => data),
                    catchError(err => {
                        this.showErrorMessage('No se pudo alcanzar el IP');
                        return throwError(err);
                    }))
            ).subscribe((data) => {
                this.ipListener.next({
                    ip: data
                });
            });
    }

    updateAlly(ally) {
        const updatedAlly = JSON.stringify(ally);
        return this.http.put(`${environment.apiUrl}/allies`, updatedAlly, httpOptions)
            .pipe(
                catchError(err => {
                    this.showErrorMessage('No se pudo actualizar aliado');
                    return throwError(err);
                }
                )
            );
    }

    deleteAlly(ally) {
        return this.http.delete(
            `${environment.apiUrl}/allies/` + ally.idAllied, httpOptions
        ).pipe(
            catchError(err => {
                this.showErrorMessage('No se pudo eliminar aliado');
                return throwError(err);
            })
        );
    }

    showErrorMessage(message) {
        this._snackBar.open(message, 'cerrar', {
            duration: 2000,
        });
    }
    /**
     * Country by letter CO, AR, EC
     */
    getAllyByCountry(country) {
        if (!country) {
            return;
        } else {
            return this.http.get<{ allies: any[] }>(`${environment.apiUrl}/allies/countries/` + country
            ).pipe(
                map((data => data),
                    catchError(err => {
                        this.showErrorMessage('No se pudo alcanzar el aliado');
                        return throwError(err);
                    }))
            ).subscribe((transformedData) => {
                this.allies = transformedData;
                this.allyListener.next({
                    allies: this.allies
                });
            });
        }
    }
}
