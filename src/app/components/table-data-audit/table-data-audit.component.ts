import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import * as _ from 'lodash';

@Component({
    selector: 'app-table-data-audit',
    templateUrl: 'table-data-audit.component.html',
    styleUrls: ['./table-data-audit.component.scss']
})

export class TableDataAuditComponent implements OnInit, OnChanges {
    @Input() dataSet;
    @Input() dataType;

    tradersCollection = [];

    displayedColumns: String[];

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor() { }

    ngOnInit() {
        this.tradersCollection = this.dataSet;
        this.updateDatable(this.tradersCollection);
        // this.dataSource.sortData;
    }

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['dataType'];
        if (change) {
            if (change.currentValue === 'traders') {
                this.displayedColumns = ['company.companyName', 'company.companyCode', 'state.state'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            } else if (change.currentValue === 'pointsSale') {
                this.displayedColumns = ['pointSale.ean', 'pointSale.name', 'pointSale.traderCode', 'pointSale.traderName', 'state.state'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            } else if (change.currentValue === 'products') {
                this.displayedColumns = ['product.ean', 'product.product', 'state.state'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            } else {
                this.displayedColumns = ['master.idMasterFile', 'master.master', 'state.state'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);            }
        }
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        };
        // implementa funcion lodash para tener acceso a objetos dentro de objetos
            this.dataSource.sortingDataAccessor = _.get;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
    }

}
