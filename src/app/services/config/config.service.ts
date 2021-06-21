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
    private companyConfigListener = new Subject<{ companyConfig: any}>();
    private traderListener = new Subject<{ traders: any}>();
    private companyConfig: any;
    private traders;

    constructor(
        private http: HttpClient,
    ) { }

    getAllyCompanyConfiguration(allyId){
       return  this.http.get(`${environment.apiUrl}/configurations/companies/allies/` + allyId).subscribe((data)=> {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        })
    }

    getAllyCompanyConfigurationByCompanyAndAlly(allyId,companyId){
        return this.http.get(`${environment.apiUrl}/configurations/companies/` + companyId + '/allies/' + allyId).subscribe((data)=> {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        })
    }

    // getCompanies() {
    //     this.http.get(`${environment.apiUrl}/configurations/companies`).subscribe((data) => {
    //         this.companies = data;
    //         this.companyListener.next({
    //             companies: this.companies
    //         });
    //     });
    // }

    getTraders() {
        this.http.get(`${environment.apiUrl}/configurations/traders`).subscribe((data) => {
            this.traders = data;
            this.traderListener.next({
                traders: this.traders
            });
        });
    }

    getAllyCompanyConfigListener() {
        return this.companyConfigListener.asObservable();
    }

    getTraderListener() {
        return this.traderListener.asObservable();
    }

    
}
