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

    uploadFile(formData) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        this.http.post(`${environment.apiUrl}/masters/`, formData, {
            reportProgress: true,
            observe: 'events',
            headers: headers
        })
            .subscribe(events => {
                if (events.type == HttpEventType.UploadProgress) {
                    console.log('Upload progress: ', Math.round(events.loaded / events.total * 100) + '%');
                } else if (events.type === HttpEventType.Response) {
                    console.log(events);
                }
            })
    }

}