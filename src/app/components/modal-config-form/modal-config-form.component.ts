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
    private configurationDate: Date = new Date();;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<ModalConfigFormComponent>,
    ) { }

    ngOnInit() { }

    save() {
        // Registro para guardar en memoria local
        const configOne = {
            idAlliedCompanyConfig: null,
            allied: { 
                idAllied: this.idAlly 
            },
            company: { 
                idCompany: this.idCompany 
            },
            state: { 
                idState: 2 
            },
            configurationDate: this.configurationDate
        }
        // Registro para seguir a paso 2 
        const registryToPush = {
            allied: {
                idAllied: this.idAlly,
                name: this.allyName
            },
            company: {
                idCompany: this.idCompany,
                companyName: this.companyName,
                companyCode: this.companyCode
            },
            state: { idState: 2 },
            // configurationDate: this.configurationDate
        }
        // Pasar ambos objetos a componente tabla
        this.dialogRef.close({configOne, registryToPush});
    }

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
    }

    filterByAllyName(allyName) {
        const filtered = this.data.allyCollection.filter(ally => ally.name == allyName);
        filtered.forEach(item => {
            this.idAlly = item.idAllied;
        });
    }

    filterByAllyId(allyId) {
        const filtered = this.data.allyCollection.filter(ally => ally.idAllied == allyId);
        filtered.forEach(item => {
            this.allyName = item.name;
        });
    }
}