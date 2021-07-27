import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment.prod';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class ProductService {
    private products;

    private productListener = new Subject<{ products: any }>();

    constructor(
        private http: HttpClient,
    ) { }

    getProductsByCompany(companyId) {
        if (!!companyId) {
            return this.http
                .get<{ products: any[] }>(`${environment.apiUrl}/products/companies/` + companyId, httpOptions)
                .pipe(
                    map((data => data))
                ).subscribe((data) => {
                    this.products = data;
                    this.productListener.next({
                        products: this.products
                    });
                });
        } else {
            return;
        }
    }

    getProductsByConfigAndCompany(configId, companyId) {
        if (!!configId && !!companyId) {
            return this.http
                .get<{ products: any[] }>(`${environment.apiUrl}/products/companies/` + companyId + '/configurations/' + configId, httpOptions)
                .pipe(
                    map((data => data))
                ).subscribe((data) => {
                    this.products = data;
                    this.productListener.next({
                        products: this.products
                    });
                });
        } else {
            return;
        }
    }

    getProductListener() {
        return this.productListener.asObservable();
    }
}