import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { TraceService } from 'src/app/services/trace/trace.service';

@Component({
    selector: 'app-trace-table',
    templateUrl: 'trace-table.component.html',
    styleUrls: ['./trace-table.component.scss']
})

export class TraceTableComponent implements OnInit, OnChanges {
    @Input() traceParams;
    @Input() isLoading: boolean;

    @Output() stopLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private traceSub: Subscription;

    fileName = 'ExcelSheet.xlsx';

    private traceCollection = [];

    displayedColumns = ['companyCode', 'companyName', 'fileName', 'creationFileDate', 'fileSentDate',
        'amountComercialPartners', 'amountRetailStore', 'amountRegistries', 'fileType', 'detail'];

    constructor(
        private traceService: TraceService
    ) { }


    ngOnChanges(changes: SimpleChanges) {
        let change = changes['traceParams']
        if (!!change) {
            if (!!change.currentValue) {
                this.fetchTrace(change.currentValue.idAlly, change.currentValue.idCompany)
            }
        }
    }

    ngOnInit() {
        this.updateTable(this.traceCollection);
    }

    fetchTrace(idAlly, idCompany) {
        this.traceService.getTrace(idAlly, idCompany);
        this.traceSub = this.traceService.getTraceListener().subscribe((traceData) => {
            this.traceCollection = traceData.trace;
            this.stopLoading.emit(false);
            this.updateTable(this.traceCollection);
            console.log(this.traceCollection);
        })
    }

    exportexcel(): void {
        const ws = XLSX.utils.json_to_sheet(this.traceCollection);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.fileName);
    }

    updateTable(collection) {
        this.dataSource = new MatTableDataSource<any>(collection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

}