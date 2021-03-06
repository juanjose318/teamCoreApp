import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-second-step-table',
    templateUrl: 'table-second-step.component.html',
    styleUrls: ['./table-second-step.component.scss'],
})

export class SecondStepTableComponent implements OnInit, OnChanges, OnDestroy {

    @Input() registry;
    @Input() tableNumber;
    @Input() configurationDone;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    @Output() objTradersToConfig: EventEmitter<any> = new EventEmitter();
    @Output() hasTradersSelected: EventEmitter<any> = new EventEmitter();
    @Output() objToCompare: EventEmitter<any> = new EventEmitter();

    private traderSub: Subscription;
    private refresh: Subscription;
    // coleccion de traders
    tradersCollection = [];
    // traders en modo edicion despues de selccionar y deseleccionar
    tradersAfterMod = [];
    // condicional para bloquear traders despues del primer llamado a configuracion
    readonlyMode = false;
    // columnas para tabla
    displayedColumns: String[] = ['selectField', 'company.companyCode', 'companyName'];
    // objeto de traders seleccionados para configuracion
    objTraders = [];
    // Codigo de fabricante
    companyCode;
    // ID de configuracion
    configId;


    dataSource: MatTableDataSource<any>;

    constructor(
        private companyConfigService: ConfigService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['registry'];
        const configurationDone = changes['configurationDone'];
        if (!!change) {
            if (!!change.currentValue) {
                if (!!change.currentValue.idAlliedCompanyConfig) {
                    this.configId = change.currentValue.idAlliedCompanyConfig;
                    this.companyCode = change.currentValue.company.companyCode;
                    this.fetchTradersWithConfig(this.configId, this.companyCode);
                    this.checkState(change.currentValue.state.idState);
                } else if (!change.currentValue.idAlliedCompanyConfig ) {
                    this.readonlyMode = false;
                    this.fetchTradersWithoutConfig(change.currentValue.company.companyCode);
                }
            }
        } if (!!configurationDone) {
            if (!!configurationDone.currentValue) {
                if (!!configurationDone.currentValue.checkMode) {
                    this.readonlyMode = configurationDone.currentValue.checkMode;
                    this.fetchTradersWithConfig(configurationDone.currentValue.idAlliedCompanyConfig, configurationDone.currentValue.company);
                    this.checkState(configurationDone.currentValue.state.idState);
                }
            }
        }
    }

    ngOnInit() {
        this.updateDatable(this.tradersCollection);
    }

    fetchTradersWithoutConfig(companyCode) {
        this.companyConfigService.getTradersFirstTime(companyCode);
        this.traderSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
            setTimeout(() => this.updateDatable(this.tradersCollection), 500);
        });
    }

    fetchTradersWithConfig(companyCode, configId) {
        this.companyConfigService.getTradersSecondtTme(companyCode, configId);
        this.traderSub = this.companyConfigService.getTraderListener().subscribe((data) => {
            this.tradersCollection = data.traders;
            this.tradersAfterMod = data.traders;
            this.objToCompare.emit(this.tradersAfterMod);
            this.pushTraders(this.tradersCollection);
            setTimeout(() => this.updateDatable(this.tradersCollection), 500);
        });
    }


    /**
     * Funcion para agregar y quitar comercios y la vez generar un estado temporal para su activaci??n o desactivaci??n
     * @param event clicked
     * @param trader comercio seleccionado
     */
    handleCheck(event: MatCheckboxChange, trader) {
        if (event.checked) {
            this.objTraders.push(trader);
            this.tradersAfterMod.forEach(traderInCl => {
                if (traderInCl.companyCode === trader.companyCode) {
                    traderInCl.idStateTemp = 1;
                }
            });
        } else {
            for (let i = this.objTraders.length - 1; i >= 0; --i) {
                if (this.objTraders[i].companyCode == trader.companyCode) {
                    this.objTraders.splice(i, 1);
                }
            }
            this.tradersAfterMod.forEach(traderInCl => {
                if (traderInCl.companyCode === trader.companyCode) {
                    traderInCl.idStateTemp = 2;
                }
            });
        }
        this.objToCompare.emit(this.tradersAfterMod);
        this.objTradersToConfig.emit(this.objTraders);

    }

    checkState(state) {
        if (state === 2) {
            this.readonlyMode = true;
        } else if (state === 1) {
            this.readonlyMode = false;
        } else {
            this.readonlyMode = false;
        }
        this.updateDatable(this.tradersCollection);
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = _.get;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        };
    }

    pushTraders(traders) {
        if (!!traders) {
            traders.forEach(trader => {
                if (trader.idAlliedCompanyConfig) {
                    this.objTraders.push(trader);
                }
            });
            this.hasTradersSelected.emit(true);

            this.objTradersToConfig.emit(this.objTraders);
        }
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngOnDestroy(): void {
        if (this.traderSub) {
            this.traderSub.unsubscribe();
        }
    }
}
