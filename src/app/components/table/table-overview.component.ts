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
    styleUrls: ['table-overview.scss'],
    templateUrl: 'table-overview.html',
})
export class TableOverviewComponent implements OnInit, OnChanges {
    /**
     * Columnas para tabla de auditoria
     */
    displayedColumns = [];
    allyAuditColumns: string[] = ['idAllied', 'actionExecuted', 'updateDate', 'creationDate', 'executor',
        'ipOrigin', 'affectedField', 'valueBefore', 'valueAfter'];
    allyCompanyAuditColumns: string[] = ['idRegistry', 'idAllied', 'allied.name', 'company.idCompany',
        'company.companyName', 'configurationDate', 'state.state', 'updateDate', 'executor', 'ipOrigin', 'actionExecuted', 'detail']
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
     * Coleccion para iterar
     */
    auditCollection = [];


    constructor(
        private auditService: AuditService,
    ) { }

    ngOnInit() {
        if(this.auditCollection)
        this.dataSource = new MatTableDataSource<any>(this.auditCollection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges() {
        if (this.audit && this.allyAuditTableNumber === 1) {
            this.auditService.getAuditByCountry(this.audit);
            this.auditSub = this.auditService.getAuditListener()
                .subscribe((filteredAudit) => {
                    this.auditCollection = filteredAudit.audit;
                    this.dataSource = new MatTableDataSource<any>(this.auditCollection);
                    this.displayedColumns = this.allyAuditColumns;
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
        }
        else if (this.allyAuditTableNumber === 2) {
            if (!!this.selectedAlly && !this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAlly(this.selectedAlly);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        // console.log(this.auditCollection);
                        this.dataSource = new MatTableDataSource<any>(this.auditCollection);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.displayedColumns = this.allyCompanyAuditColumns;

                    });
            }
            else if (!!this.selectedAlly && !!this.selectedCompany) {
                this.auditService.getAuditConfigAllyCompanyByAllyAndCompany(this.selectedAlly, this.selectedCompany);
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.dataSource = new MatTableDataSource<any>(this.auditCollection);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.displayedColumns = this.allyCompanyAuditColumns;

                    });
            }
            else {
                this.auditService.getAllAllyCompanyConfig();
                this.auditSub = this.auditService.getAuditListener()
                    .subscribe((filteredAudit) => {
                        this.auditCollection = filteredAudit.audit;
                        this.dataSource = new MatTableDataSource<any>(this.auditCollection);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                        this.displayedColumns = this.allyCompanyAuditColumns;

                    });
            }
        }
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
}

