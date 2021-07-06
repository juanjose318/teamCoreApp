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
        if(!allyId) {
            return;
        }
       return  this.http.get(`${environment.apiUrl}/configurations/companies/allies/` + allyId, httpOptions).subscribe((data)=> {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        })
    }

    getAllyCompanyConfigurationByCompanyAndAlly(allyId,companyId){
        if(!allyId || !companyId) {
            return;
        }
        return this.http.get(`${environment.apiUrl}/configurations/companies/` + companyId + '/allies/' + allyId, httpOptions).subscribe((data)=> {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        })
    }

    getAllAllyCompanyConfig(){
        return this.http.get(`${environment.apiUrl}/configurations/companies/`, httpOptions).subscribe((data)=> {
            this.companyConfig = data;
            this.companyConfigListener.next({
                companyConfig: this.companyConfig
            });
        })
    }
    
    activateOrDeactivateComercialRelation(relation){
        const convertedRelation = JSON.stringify(relation);
        return this.http.put(`${environment.apiUrl}/configurations/companies`, convertedRelation, httpOptions).subscribe();
    }

    getTradersByConfigId(configId){
        if(!configId) {
            return;
        }
        this.http.get(`${environment.apiUrl}/configurations/traders/companiesconfig/`+ configId).subscribe((data) => {
            this.traders = data;
            this.traderListener.next({
                traders: this.traders
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

    getAllyCompanyConfigListener() {
        return this.companyConfigListener.asObservable();
    }

    getTraderListener() {
        return this.traderListener.asObservable();
    }

    
}
