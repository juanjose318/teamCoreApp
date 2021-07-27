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
    selector: 'app-table-configs-audit',
    templateUrl: 'table-configs-audit.component.html',
    styleUrls: ['table-configs-audit.component.scss'],

})
export class TableConfigsAuditComponent implements OnInit, OnChanges {
    /**
     * Columnas para tabla de auditoria
     */
    displayedColumns: string[] = ['idAlliedCompanyConfAudit', 'allied.idAllied', 'allied.name', 'company.companyName',
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
     * Filtros
     */
    @Input() selectedCompany;
    @Input() selectedAlly;

    /**
     * Objeto para auditoria de configuracion de aliados
     */
    @Input() updatedAudit;

    /**
     * Ya termino la configuracion y se genero auditoria
     */
    @Input() configurationDone;

    /**
     * Coleccion para iterar
     */
    auditCollection = [];
    isUpdated: boolean;

    constructor(
        private auditService: AuditService,
        public dialog: MatDialog,
    ) { }

    ngOnInit() {
        this.updateTable(this.auditCollection);
        this.auditSub = new Subscription;
    }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['configurationDone'];
        const changeAudit = changes['updatedAudit'];
        const changesAlly = changes['selectedAlly'];
        const changesCompany = changes['selectedCompany'];

        if (!!this.selectedAlly && !this.selectedCompany) {
            this.fetchAuditByAlly(this.selectedAlly);
        } else if (!!this.selectedAlly && !!this.selectedCompany) {
            this.fetchAuditByAllyCompany(this.selectedAlly, this.selectedCompany);
        } else if (change) {
            if (change.currentValue) {
                if (change.currentValue.isDone) {
                    this.fetchAuditByAllyCompany(change.currentValue.ally, change.currentValue.company);
                }
            }
        } if (!!changeAudit) {
            if (!!changeAudit.currentValue) {
                this.isUpdated = changeAudit.currentValue;
                this.handleAuditCompanyConfig();
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
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    fetchAuditByAllyCompany(ally, company) {
        this.auditService.getAuditConfigAllyCompanyByAllyAndCompany(ally, company);
        this.auditSub = this.auditService.getAuditListener().pipe().subscribe((filteredAudit: any) => {
            this.auditCollection = filteredAudit.audit;
            this.updateTable(this.auditCollection);
        });
    }

    fetchAuditByAlly(ally) {
        this.auditService.getAuditConfigAllyCompanyByAlly(ally);
        this.auditSub = this.auditService.getAuditListener()
            .subscribe((filteredAudit) => {
                this.auditCollection = filteredAudit.audit;
                this.updateTable(this.auditCollection);
            });
    }

    exportexcel(): void {
        const options = {
            quoteStrings: '',
            headers: ['ID Aliado', 'Aliado', 'Estado', 'Compañía', 'Ejecutado por', 'IP Origen',
                'Fecha de Configuración', 'Fecha de Actualización']
        };
        const dataToExport = this.dataSource.filteredData.map((audits) => {
            return {
                idAlliedCompanyConfAudit: audits.idAlliedCompanyConfAudit,
                alliedName: audits.allied.name,
                state: audits.state.state,
                company: audits.company.companyName,
                executor: audits.executor,
                ipOrigin: audits.ipOrigin,
                configurationDate: audits.configurationDate,
                updateDate: audits.updateDate
            };
        });
        new AngularCsv(dataToExport, 'Reporte Auditoría', options);
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

    handleAuditCompanyConfig() {
        if (this.isUpdated) {
            if (!!this.selectedAlly && !this.selectedCompany) {
                this.fetchAuditByAlly(this.selectedAlly);
            } else if (!!this.selectedAlly && !!this.selectedCompany) {
                this.fetchAuditByAllyCompany(this.selectedAlly, this.selectedCompany);
            }
        }
        this.isUpdated = false;
    }
}
