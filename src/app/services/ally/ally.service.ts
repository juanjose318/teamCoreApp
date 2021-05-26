import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Aliado } from 'src/app/models/aliado.interface';

@Injectable({ providedIn: 'root' })
export class AliadoService {
    private allyListener = new Subject<{ allies: any[] }>();

    private allies: any;
    private jsonUrl = '../../assets/db/db.json';
    constructor(
        private http: HttpClient,
    ) {
    }

    getAllies() {
        return this.http.get(this.jsonUrl)
            .subscribe((data => {
                this.allies = data;
                this.allyListener.next({
                    allies: this.allies
                })
            }));
    }

    getAllyListener() {
        return this.allyListener.asObservable();
    }

}