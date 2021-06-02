import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Aliado } from 'src/app/models/aliado.interface';

import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AliadoService {
    private allyListener = new Subject<{ allies: any }>();
    private allies: any;
    constructor(
        private http: HttpClient,
    ) { }

    getAllies() {
        return this.http
            .get<{ allies: any[] }>(`${environment.apiUrl}/allies`)
            .pipe(
                map((data => data))
            ).subscribe((transformedData) => {
                this.allies = transformedData;
                this.allyListener.next({
                    allies: this.allies
                });
            });
    }

    getAllyListener() {
        return this.allyListener.asObservable();
    }

    /**
     * Country by letter CO, AR, EC
     */

    getAllyByCountry(country) {
        return this.http.get<{ allies: any[] }>(`${environment.apiUrl}/allies/countries/` + country
        ).pipe(
            map((data => data))
        ).subscribe((transformedData) => {
            this.allies = transformedData;
            this.allyListener.next({
                allies: this.allies
            });
        });
    }
}
