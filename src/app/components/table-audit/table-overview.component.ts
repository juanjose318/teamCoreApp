import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { AuditService } from 'src/app/services/audit/audit.service';

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
    allyCompanyAuditColumns: string[] = ['idRegistry', 'idAllied', 'allied.name', 'company.idCompany',
        'company.companyName', 'configurationDate', 'state.state', 'updateDate', 'executor', 'ipOrigin','detail']
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
     * Coleccion para iterar
     */
    auditCollection = [];


    constructor(
        private auditService: AuditService,
    ) { }

    ngOnInit() {
        this.updateTable(this.auditCollection);
        // Modificar filtro
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
            return data.allied.idAllied.toLowerCase().includes(filter) || data.allied.name.toLowerCase().includes(filter) || data.company.idCompany.toString().includes(filter) || data.company.companyName.toString().includes(filter)
            || data.configurationDate.toString().includes(filter) || data.state.state.toString().includes(filter) || data.executor.toString().includes(filter) || data.ipOrigin.toString().includes(filter) || data.updateDate.toString().includes(filter)
            || data.executor.toString().includes(filter) === filter;
        };
    }

    ngOnChanges() {
        if (!!this.objAllyCompanyAudit) {
            this.handleAuditCompanyConfig(this.objAllyCompanyAudit);
        }
        if (this.audit && this.allyAuditTableNumber === 1) {
            this.auditService.getAuditByCountry(this.audit);
            this.auditSub = this.auditService.getAuditListener()
                .subscribe((filteredAudit) => {
                    this.auditCollection = filteredAudit.audit;
                    this.updateTable(this.auditCollection)
                    this.displayedColumns = this.allyAuditColumns;
                });
        }
        else if (this.allyAuditTableNumber === 2 || this.allyAuditTableNumber === 3 || this.allyAuditTableNumber === 4) {
            if (!!this.selectedAlly && !this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAlly(this.selectedAlly);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.updateTable(this.auditCollection)
                        this.displayedColumns = this.allyCompanyAuditColumns;

                    });
            }
            else if (!!this.selectedAlly && !!this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAllyAndCompany(this.selectedAlly, this.selectedCompany);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.updateTable(this.auditCollection)
                        this.displayedColumns = this.allyCompanyAuditColumns;
                    });
            }
        }
    }

    updateTable(collection) {
        this.dataSource = new MatTableDataSource<any>(collection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    exportexcel(): void {
        const ws = XLSX.utils.json_to_sheet(this.auditCollection);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.fileName);
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        } 
    }

    handleAuditCompanyConfig(configAllyCompAudit) {
        if (configAllyCompAudit) {
            this.auditService.creatAllyCompanyConfig(configAllyCompAudit).subscribe(() => {
                this.updateTable(this.auditCollection)
                this.auditCollection.push(configAllyCompAudit);
            });
        }
    }
}

