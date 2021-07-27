import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

// import { environment } from '../../../environments/environment.prod';
import { environment } from '../../../environments/environment';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class PointsOfSaleService {
    private pointsOfSale;
    private pointsOfSaleListener = new Subject<{ pointsOfSale: any }>();

    constructor(
        private http: HttpClient
    ) { }

    getPointsOfSale(idAlliedCompanyConfig) {
        if (!!idAlliedCompanyConfig) {
            return this.http
                .get<{ pointsOfSale: any[] }>(`${environment.apiUrl}/pointssale/configurations/` + idAlliedCompanyConfig, httpOptions)
                .pipe(
                    map((data => data))
                ).subscribe((data) => {
                    this.pointsOfSale = data;
                    this.pointsOfSaleListener.next({
                        pointsOfSale: this.pointsOfSale
                    });
                });
        } else {
            return;
        }
    }

    postTradersToGetPointSale(traders) {

        return this.http.post(`${environment.apiUrl}/pointssale/traders`, traders);
    }

    getPointsOfSaleListener() {
        return this.pointsOfSaleListener.asObservable();
    }
}
