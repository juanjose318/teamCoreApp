import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MasterFile } from 'src/app/models/MasterFile.interface';

import { environment } from '../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class MasterFileService {
    private masterFiles;

    private masterFileListener = new Subject<{ masterFiles: any }>();

    constructor(
        private http: HttpClient,
    ) { }

    getMasterFiles(idAlliedCompanyConfig) {
        return this.http
            .get<{ masterFiles: any[] }>(`${environment.apiUrl}/masters/` + idAlliedCompanyConfig, httpOptions)
            .pipe(
                map((data => data))
            ).subscribe((data) => {
                this.masterFiles = data;
                this.masterFileListener.next({
                    masterFiles: this.masterFiles
                });
            });
    }

    getMasterFileListener() {
        return this.masterFileListener.asObservable();
    }

    upload(formData) {
        return this.http.post<any>(`${environment.apiUrl}/masters/`, formData, {
            reportProgress: true,
            observe: 'events'
        });
    }

    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file.data);
        file.inProgress = true;
        this.masterFiles.upload(formData).pipe(
            map(event => {
            }),
            catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                return of(`Upload failed: ${file.data.name}`);
            })).subscribe((event: any) => {
                if (typeof (event) === 'object') {
                    console.log(event.body);
                }
            });
    }

}