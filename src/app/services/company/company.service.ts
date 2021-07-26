import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class CompanyService {
    private companies;

    private companyListener = new Subject<{ companies: any }>();

    constructor(
        private http: HttpClient,
    ) { }

    getCompanies() {
        return this.http
            .get<{ companies: any[] }>(`${environment.apiUrl}/companies`, httpOptions)
            .pipe(
                map((data => data))
            ).subscribe((data) => {
                this.companies = data;
                this.companyListener.next({
                    companies: this.companies
                });
            });
    }


    getCompaniesByCountry(countryCode) {
        if (!countryCode) {
            return;
        }
        else {
            return this.http
                .get<{ companies: any[] }>(`${environment.apiUrl}/companies/countries/` + countryCode, httpOptions)
                .pipe(
                    map((data => data))
                ).subscribe((data) => {
                    this.companies = data;
                    this.companyListener.next({
                        companies: this.companies
                    });
                });
        }
    }

    getCompanyListener() {
        return this.companyListener.asObservable();
    }
}