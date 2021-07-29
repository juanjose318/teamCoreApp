import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AuditService } from 'src/app/services/audit/audit.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
    selector: 'app-table-allies-audit',
    templateUrl: 'table-allies-audit.component.html',
    styleUrls: ['table-allies-audit.component.scss'],

})
export class TableAlliesAuditComponent implements OnInit, OnChanges, OnDestroy {

    /**
    * audit es el pais seleccionado para filtrar
    */
    @Input() audit;

    /**
     * Objeto para auditoria de configuracion de aliados
     */
    @Input() objAllyCompanyAudit;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /**
     * Subscriber para auditorias
     */
    private auditSub: Subscription;

    dataSource: MatTableDataSource<any>;

    /**
     * Columnas para tabla de auditoria
    */
    displayedColumns = ['idAllied', 'actionExecuted', 'updateDate', 'creationDate', 'executor',
        'ipOrigin', 'affectedField', 'valueBefore', 'valueAfter'];

    /**
     * Coleccion para iterar
     */
    auditCollection = [];

    selectedCountry;

    constructor(
        private auditService: AuditService,
    ) { }

    ngOnInit() {
        this.fetchAuditByCountry('CO');
        this.updateTable(this.auditCollection);
    }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['audit'];
        if (change) {
            if (change.currentValue) {
                this.selectedCountry = change.currentValue;
                this.fetchAuditByCountry(this.selectedCountry);
            }
        }
    }

    updateTable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = _.get;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        };
    }

    fetchAuditByCountry(country) {
        this.auditService.getAuditByCountry(country);
        this.auditSub = this.auditService.getAuditListener()
            .subscribe((filteredAudit) => {
                this.auditCollection = filteredAudit.audit;
                console.log('21')
                this.updateTable(this.auditCollection);
            });
    }

    exportexcel(): void {
        const options = {
            quoteStrings: '',
            headers: ['ID Registro', 'ID Aliado', 'Estado', 'Código País', 'Acción Ejecutada', 'Ejecutado por',
                'Campo Afectado', 'Valor Antes', 'Valor Después', 'IP Origen', 'Fecha de Configuración', 'Fecha de Actualización']
        };
        new AngularCsv(this.auditCollection, 'Auditoría', options);
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    handleClick() {
        this.dataSource.sort = this.sort;
    }

    handleCreateAudit(allyAudit) {
        if (allyAudit) {
            this.auditService.creatAllyCompanyConfig(allyAudit).subscribe(() => {
                this.fetchAuditByCountry(this.selectedCountry);
            });
        }
    }

    ngOnDestroy() {
        if (this.auditSub) {
            this.auditSub.unsubscribe();
        }
    }
}

