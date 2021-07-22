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
    }

    ngOnChanges(changes: SimpleChanges) {
        let change = changes['dataType'];
        if (change) {
            console.log(change.currentValue);
            if (change.currentValue === 'traders') {
                this.displayedColumns = ['company.companyName', 'company.companyCode', 'state.state'];
                console.log(this.dataSet);
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            }
            else if (change.currentValue === 'pointsSale') {
                this.displayedColumns = ['ean', 'name', 'code', 'companyName', 'action'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            } else if (change.currentValue === 'products') {
                this.displayedColumns = ['ean', 'name', 'action'];
                setTimeout(() => this.updateDatable(this.dataSet), 0.2);
            }
            else {
                // Masterfile
            }
        }
    }

    applyFilter(filterValue) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log(this.dataSource.filter);
        // if (this.dataSource.paginator) {
        //     this.dataSource.paginator.firstPage();
        // }
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.filterPredicate = (data: any, filter) => {
            const dataStr = JSON.stringify(data).toLowerCase();
            return dataStr.indexOf(filter) != -1;
        }
        // implementa funcion lodash para tener acceso a objetos dentro de objetos
            this.dataSource.sortingDataAccessor = _.get; 
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
    }

}