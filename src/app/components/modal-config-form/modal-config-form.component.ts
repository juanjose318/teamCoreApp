import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-modal-config-form',
    templateUrl: 'modal-config-form.component.html',
    styleUrls: ['./modal-config-form.component.scss']
})

export class ModalConfigFormComponent implements OnInit {
    /**
     * Campos para data binding y creacion de objetos
     */
    private idAlly;
    private allyName;
    private idCompany;
    private companyCode;
    private companyName;
    
    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalConfigFormComponent>,
    ) { }

    ngOnInit() { }

    close() {
        this.dialogRef.close();
    }

    filterByCompanyCode(companyCode) {
        const filtered = this.data.companyCollection.filter(company => company.companyCode == companyCode);
        filtered.forEach(item => {
            this.idCompany = item.idCompany;
            this.companyName = item.companyName;
        });
    }

    filterByCompanyId(companyId) {
        const filtered = this.data.companyCollection.filter(company => company.idCompany == companyId);
        filtered.forEach(item => {
            this.companyCode = item.companyCode;
            this.companyName = item.companyName;
        });
    }

    filterByCompanyName(companyName) {
        const filtered = this.data.companyCollection.filter(company => company.companyName == companyName);
        filtered.forEach(item => {
            this.companyCode = item.companyCode;
            this.idCompany = item.idCompany;
        });

        console.log(filtered);
    }

    filterByAllyName(allyName) {
        const filtered = this.data.allyCollection.filter(ally => ally.name == allyName);
        filtered.forEach(item => {
            this.idAlly = item.idAllied;
        });
    }

    filterByAllyId(allyId) {
        console.log(allyId);
        const filtered = this.data.allyCollection.filter(ally => ally.idAllied == allyId);
        filtered.forEach(item => {
            this.allyName = item.name;
        });
    }
}