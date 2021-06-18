import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({providedIn: 'root'})
export class ConfigService {
    private companyListener = new Subject<{ companies: any}>();
    private traderListener = new Subject<{ traders: any}>();
    private companies: any;
    private traders;

    constructor(
        private http: HttpClient,
    ) { }

    getCompanies() {
        this.http.get(`${environment.apiUrl}/configurations/companies`).subscribe((data) => {
            this.companies = data;
            this.companyListener.next({
                companies: this.companies
            });
        });
    }

    getTraders() {
        this.http.get(`${environment.apiUrl}/configurations/traders`).subscribe((data) => {
            this.traders = data;
            this.traderListener.next({
                traders: this.traders
            });
        });
    }

    getCompanyListener() {
        return this.companyListener.asObservable();
    }

    getTraderListener() {
        return this.traderListener.asObservable();
    }

    
}
