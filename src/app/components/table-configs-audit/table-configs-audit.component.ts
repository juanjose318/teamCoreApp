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
    @Input() selectedCountry;

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
        this.auditService.refresh$.subscribe(() => {
            this.filterAudit(this.selectedAlly, this.selectedCompany, this.selectedCountry);
        });
        this.updateTable(this.auditCollection);
    }

    ngOnChanges() {
        this.filterAudit(this.selectedAlly, this.selectedCompany, this.selectedCountry);
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

    filterAudit(ally, company, country) {
        if (country === 'ALL' && ally === 'ALL' && !company) {
            this.fetchAllAudits();
        } else if(( !!country && country !== 'ALL') && ally === 'ALL' && !company ) {
            this.fetchAuditsByCountry(country);
        } else if (ally === 'ALL' && !!company ) {
           this.fetchAuditsByCompany(company);
        } else if ((!!ally && ally !== 'ALL') && !company) {
            this.fetchAuditByAlly(ally);
        } else if (!!ally && !!company) {
            this.fetchAuditByAllyCompany(ally, company);
        }
    }

    fetchAllAudits() {
        this.auditService.getAllAudits();
        this.auditSub = this.auditService.getAuditListener().subscribe((data) => {
            this.auditCollection = data.audit;
            this.updateTable(this.auditCollection);
        });
    }

    fetchAuditsByCountry(country) {
        this.auditService.getConfigAuditsByCountry(country);
        this.auditSub = this.auditService.getAuditListener().subscribe((data:any) => {
            this.auditCollection = data.audit;
            this.updateTable(this.auditCollection);
        });
    }

    fetchAuditsByCompany(idCompany) {
        this.auditService.getAuditsByCompany(idCompany);
        this.auditSub = this.auditService.getAuditListener().subscribe((data) => {
            this.auditCollection = data.audit;
            this.updateTable(this.auditCollection);
        });
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
}
