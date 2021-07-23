import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuditService } from 'src/app/services/audit/audit.service';
import { ModalAuditComponent } from '../modal-audit/modal-audit.component';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-table-overview',
    templateUrl: 'table-overview.component.html',
    styleUrls: ['table-overview.component.scss'],

})
export class TableOverviewComponent implements OnInit, OnChanges {
    /**
     * Columnas para tabla de auditoria
     */
    displayedColumns = [];
    allyAuditColumns: string[] = ['idAllied', 'actionExecuted', 'updateDate', 'creationDate', 'executor',
        'ipOrigin', 'affectedField', 'valueBefore', 'valueAfter'];
    allyCompanyAuditColumns: string[] = ['idAlliedCompanyConfAudit', 'allied.idAllied', 'allied.name', 'company.companyName',
        'configurationDate', 'state.state', 'updateDate', 'executor', 'ipOrigin', 'detail'];

    /**
     * Recurso de display de data para tabla material
     */
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /**
     * Nombre de archivo para descarga
     */
    fileName = 'ExcelSheet.xlsx';

    /**
     * Subscriber para auditorias
     */
    private auditSub: Subscription;

    /**
     * audit es el pais seleccionado para filtrar
     */
    @Input() audit;

    /**
     * Filtros y numero de tabla
     */
    @Input() allyAuditTableNumber;
    @Input() selectedCompany;
    @Input() selectedAlly;

    /**
     * Objeto para auditoria de configuracion de aliados
     */
    @Input() objAllyCompanyAudit;

    /**
     * Ya termino la configuracion y se genero auditoria
     */
    @Input() configurationDone;

    /**
     * Coleccion para iterar
     */
    auditCollection = [];

    constructor(
        private auditService: AuditService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.updateTable(this.auditCollection);
    }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['configurationDone'];

        if (!!this.objAllyCompanyAudit) {
            this.handleAuditCompanyConfig(this.objAllyCompanyAudit);
        }
        if (this.audit && this.allyAuditTableNumber === 1) {
            this.auditService.getAuditByCountry(this.audit);
            this.auditSub = this.auditService.getAuditListener()
                .subscribe((filteredAudit) => {
                    this.auditCollection = filteredAudit.audit;
                    this.updateTable(this.auditCollection);
                    this.displayedColumns = this.allyAuditColumns;
                });
        } else if (this.allyAuditTableNumber === 2) {
            if (!!this.selectedAlly && !this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAlly(this.selectedAlly);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.displayedColumns = this.allyCompanyAuditColumns;
                        this.updateTable(this.auditCollection);
                    });
            } else if (!!this.selectedAlly && !!this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAllyAndCompany(this.selectedAlly, this.selectedCompany);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.updateTable(this.auditCollection);
                        this.displayedColumns = this.allyCompanyAuditColumns;
                    });
            } else if (change) {
                if (change.currentValue) {
                    if (change.currentValue.isDone) {
                        this.auditService.getAuditConfigAllyCompanyByAllyAndCompany(change.currentValue.ally, change.currentValue.company);
                        this.auditSub = this.auditService.getAuditListener().subscribe((filteredAudit) => {
                                this.auditCollection = filteredAudit.audit;
                                console.log(this.auditCollection);
                                this.displayedColumns = this.allyCompanyAuditColumns;
                                this.updateTable(this.auditCollection);
                        });
                    }
                }
            }
        }
    }

    updateTable(collection) {
        this.dataSource = new MatTableDataSource<any>(collection);
        // Modificar filtro
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        };
        this.dataSource.sortingDataAccessor = _.get;
        setTimeout(() => this.dataSource.sort = this.sort, 0.2);
        this.dataSource.paginator = this.paginator;
    }

    exportexcel(): void {
        const options = {
            quoteStrings: '',
            headers: ['ID Aliado', 'Aliado', 'Estado', 'Compañía', 'Acción Ejecutada', 'Ejecutado por',
             'Fecha de Configuración', 'Fecha de Actualización']
        };
        new AngularCsv(this.auditCollection, 'Reporte Puntos de Venta', options);
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    openModalForAudit(audit) {
        const dialogRef = this.dialog.open(ModalAuditComponent, {
            data: { registry: audit }
        });
    }

    handleAuditCompanyConfig(configAllyCompAudit) {
        if (configAllyCompAudit) {
            this.auditService.creatAllyCompanyConfig(configAllyCompAudit).subscribe(() => {
                this.updateTable(this.auditCollection);
            });
        }
    }
}

