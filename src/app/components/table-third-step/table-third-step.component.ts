import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MasterFile } from 'src/app/models/MasterFile.interface';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';
import { ProductService } from 'src/app/services/products/products.service';
import { AngularCsv } from 'angular7-csv';
import { Subscription, SubscriptionLike } from 'rxjs';

@Component({
    selector: 'app-table-third-step',
    templateUrl: 'table-third-step.component.html',
    styleUrls: ['./table-third-step.component.scss']
})

export class ThirdStepTableComponent implements OnInit, OnChanges {

    @Input() registry;

    @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
    @Output() downloadCSV: EventEmitter<any> = new EventEmitter();
    @Output() previousStep: EventEmitter<any> = new EventEmitter();

    dataSourceMaster: MatTableDataSource<MasterFile>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    /**
   * Columnas para configuracion de masterfile
   */
    displayedColumns = ['id', 'startLoadingDate', 'user', 'master', 'fileUploaded', 'state', 'errorDetail'];

    masterFileCollection = [];

    selectedMaster;

    private masterSub: Subscription;

    constructor(
        private masterFileService: MasterFileService,
        private productService: ProductService,
    ) { }

    ngOnInit() {
        if (this.registry) {
            this.masterFileService.getMasterFiles(this.registry.idAlliedCompanyConfig);
            this.masterSub = this.masterFileService.getMasterFileListener().subscribe((dataMaster) => {
                this.masterFileCollection = dataMaster.masterFiles;
                this.updateDatable(this.masterFileCollection);
            });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!!changes) {
            let change = changes['registry']
            if (change.currentValue) {
                let companyConfigId = this.registry.idAlliedCompanyConfig;
                this.masterFileService.getMasterFiles(companyConfigId);
                this.masterFileService.getMasterFileListener().subscribe((data) => {
                    this.masterFileCollection = data.masterFiles;
                    this.updateDatable(this.masterFileCollection);
                    this.isLoading.emit(false);
                });
            }
        }
    }

    updateDatable(dataSource) {
        this.dataSourceMaster = new MatTableDataSource<MasterFile>(dataSource);
        this.dataSourceMaster.paginator = this.paginator;
        this.dataSourceMaster.sort = this.sort;
    }
    /**
     * Llamar archivos masterfile
     */
    fetchMasterFile() {

    }
    /**
     * Llamar puntos de venta
     */
    fetchPointsOfSale() {

    }
    /**
     * LLamar productos
     */
    fetchProducts() {

    }

    changeMaster(master){
        if(master === 'PR') {
            this.selectedMaster = master;
        }
        else if (master ==='PV'){
            this.selectedMaster = master;
        } else {
            return;
        }
    }

    exportCsv(companyId) {
        this.productService.getProductsByCompany(companyId);
        this.productService.getProductListener().subscribe((data) => {
            new AngularCsv(data.products, 'Reporte Productos');
        });
    }
    /**
    * Ir al paso anterior
    */
    goToPreviousStep() {
        this.previousStep.emit(true);
    }
}