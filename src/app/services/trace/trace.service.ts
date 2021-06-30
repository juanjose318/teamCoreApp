import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class TraceService {

    private traceListener = new Subject<{ trace: any }>();

    constructor(
        private http: HttpClient,
    ) { }

    getTrace(idAlly, idCompany) {
        return this.http
            .get<{ trace: any[] }>(`${environment.apiUrl}/traces/allies/` + idAlly + '/companies/' + idCompany)
            .pipe(
                map((data => data))
            ).subscribe((transformedData) => {
                this.traceListener.next({
                    trace: transformedData
                });
            });
    }

    getTraceListener() {
        return this.traceListener.asObservable();
    }
}

