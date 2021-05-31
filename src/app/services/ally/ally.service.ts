import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AliadoService {
    private allyListener = new Subject<{ allies: any[] }>();
    private allies: any;
    private jsonUrl = '../../assets/db/db.json';
    constructor(
        private http: HttpClient,
    ) { }

    getAllies() {
        return this.http.get(this.jsonUrl)
            .subscribe((data => {
                this.allies = data;
                this.allyListener.next({
                    allies: this.allies
                });
            })
            );
    }

    getAllyListener() {
        return this.allyListener.asObservable();
    }
}