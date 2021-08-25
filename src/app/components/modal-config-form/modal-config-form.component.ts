import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
    selector: 'app-modal-config-form',
    templateUrl: 'modal-config-form.component.html',
    styleUrls: ['./modal-config-form.component.scss']
})

export class ModalConfigFormComponent implements OnInit, OnDestroy {
    /**
     * Campos para data binding y creacion de objetos
     */
    idAlly;
    allyName;
    idCompany;
    companyCode;
    companyName;
    configurationDate: Date = new Date();
    saving: boolean;

    allyCollectionForConfiguration = [];
    companyCollectionForConfiguration = [];

    allySub: Subscription;
    companySub: Subscription;
    allyCompanyConfig: Subscription;

    constructor(
        private allyService: AliadoService,
        private dialogRef: MatDialogRef<ModalConfigFormComponent>,
        private companyService: CompanyService,
        private _snackBar: MatSnackBar,
        private companyConfigService: ConfigService,
    ) { }

    ngOnInit() {
        this.allyService.getAllies();
        this.allySub = this.allyService.getAllyListener()
            .subscribe((data) => this.allyCollectionForConfiguration = data.allies);
        this.companyService.getCompanies();
        this.companySub = this.companyService.getCompanyListener()
            .subscribe((data) => this.companyCollectionForConfiguration = data.companies);
    }

    save() {
        // Registro para guardar en memoria local
        this.saving = true;
        if (this.idAlly && this.allyName && this.companyCode && this.companyName && this.saving) {
            this.companyConfigService.getAllyCompanyConfigurationByCompanyAndAlly(this.idAlly, this.idCompany);
            this.allyCompanyConfig = this.companyConfigService.getAllyCompanyConfigListener().subscribe(
                (collection: any) => {
                    if (collection.companyConfig.length >= 1 && this.saving === true) {
                        this._snackBar.open('No se pueden crear alianzas ya existentes', 'cerrar', {
                            duration: 2000,
                        });
                        return;
                    } else {
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
                        };
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
                        };
                        // Pasar ambos objetos a componente tabla
                        this.saving = false;
                        this.dialogRef.close({ configOne, registryToPush });
                    }
                }
            );
        } else {
            this._snackBar.open('No se pueden guardar configuraciones vacías', 'cerrar', {
                duration: 2000,
            });
        }

    }

    close() {
        this.dialogRef.close();
    }

    filterByCompanyCode(companyCode) {
        const filtered = this.companyCollectionForConfiguration.filter(company => company.companyCode == companyCode);
        filtered.forEach(item => {
            this.idCompany = item.idCompany;
            this.companyName = item.companyName;
        });
    }

    filterByCompanyId(companyId) {
        const filtered = this.companyCollectionForConfiguration.filter(company => company.idCompany == companyId);
        filtered.forEach(item => {
            this.companyCode = item.companyCode;
            this.companyName = item.companyName;
        });
    }

    filterByCompanyName(companyName) {
        const filtered = this.companyCollectionForConfiguration.filter(company => company.companyName == companyName);
        filtered.forEach(item => {
            this.companyCode = item.companyCode;
            this.idCompany = item.idCompany;
        });
    }

    filterByAllyName(allyName) {
        const filtered = this.allyCollectionForConfiguration.filter(ally => ally.name == allyName);
        filtered.forEach(item => {
            this.idAlly = item.idAllied;
        });
    }

    filterByAllyId(allyId) {
        const filtered = this.allyCollectionForConfiguration.filter(ally => ally.idAllied == allyId);
        filtered.forEach(item => {
            this.allyName = item.name;
        });
    }

    ngOnDestroy(): void {
        if (this.allySub || this.companySub || this.allyCompanyConfig) {
            this.allySub.unsubscribe();
            this.companySub.unsubscribe();
            this.allyCompanyConfig.unsubscribe();
        }
    }
}
