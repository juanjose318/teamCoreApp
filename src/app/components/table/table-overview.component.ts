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
    displayedColumns: string[] = ['idAllied', 'actionExecuted', 'updateDate', 'creationDate', 'executor',
        'ipOrigin', 'affectedField', 'valueBefore', 'valueAfter'];
    dataSource: MatTableDataSource<any>;
    fileName = 'ExcelSheet.xlsx';
    private auditSub: Subscription;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() audit;

    auditCollection;

    constructor(
        private auditService: AuditService,
    ) { }

    ngOnInit() {
        this.dataSource = new MatTableDataSource<any>(this.auditCollection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    ngOnChanges(): void {
        if (this.audit) {
        this.auditService.getAuditByCountry(this.audit);
        this.auditSub = this.auditService.getAuditListener()
          .subscribe((filteredAudit) => {
            this.auditCollection = filteredAudit.audit;
            this.dataSource = new MatTableDataSource<any>(filteredAudit.audit);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
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

