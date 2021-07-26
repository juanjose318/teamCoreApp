import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { TraceService } from 'src/app/services/trace/trace.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-trace-table',
    templateUrl: 'trace-table.component.html',
    styleUrls: ['./trace-table.component.scss']
})

export class TraceTableComponent implements OnInit, OnChanges, OnDestroy {
    @Input() traceParams;
    @Input() isLoading: boolean;

    @Output() stopLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private traceSub: Subscription;


    private traceCollection = [];

    displayedColumns = ['company.companyCode', 'company.companyName', 'fileName', 'generationDate', 'sendDate',
        'numberTraders', 'numberPointsSale', 'numberProducts', 'numberRecords', 'fileType', 'detail'];

    constructor(
        private traceService: TraceService,
        private datepipe: DatePipe,

    ) { }


    ngOnChanges(changes: SimpleChanges) {
        const change = changes['traceParams'];
        if (!!change) {
            if (!!change.currentValue) {
                this.fetchTrace(change.currentValue.idAlly, change.currentValue.idCompany);
            }
        }
    }

    ngOnInit() {
        this.updateTable(this.traceCollection);
        this.traceSub = new Subscription;
    }

    fetchTrace(idAlly, idCompany) {
        this.traceService.getTrace(idAlly, idCompany);
        this.traceSub = this.traceService.getTraceListener().subscribe((traceData) => {
            this.traceCollection = traceData.trace;
            this.stopLoading.emit(false);
            this.updateTable(this.traceCollection);
        });
    }

    exportexcel(): void {
        const options = {
            quoteStrings: '',
            headers: ['Código Empresa', 'Nombre Empresa', 'Nombre del Archivo', 'Fecha de Generación del Archivo',
                'Fecha Envío del Archivo', 'Nro. Pto Vta Incluidos',
                'Nro. Socios Comerciales Incluidos', 'Nro. Productos', 'Nro. de Registros', 'Tipo de Archivo']
        };

        const mappedTraceCollection = this.traceCollection.map((item) => {
            return {
                compayCode: item.company.companyCode,
                companyName: item.company.companyName,
                fileName: item.fileName,
                generationDate: this.datepipe.transform(item.generationDate, 'yMMdHHMMSSm'),
                sendDate: item.sendDate,
                numberPointsSale: item.numberPointsSale,
                numberTraders: item.numberTraders,
                numberProducts: item.numberProducts,
                numberRecords: item.numberRecords,
                fileType: item.fileType,
            };
        });

        new AngularCsv(mappedTraceCollection, 'Reporte', options);
    }

    updateTable(collection) {
        this.dataSource = new MatTableDataSource<any>(collection);
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Registros por página';
        this.dataSource.sortingDataAccessor = _.get;
        this.dataSource.sort = this.sort;
    }

    ngOnDestroy(): void {
        if (this.traceSub) {
            this.traceSub.unsubscribe();
        }
    }
}
