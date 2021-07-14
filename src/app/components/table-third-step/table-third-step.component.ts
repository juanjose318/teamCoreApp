import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MasterFile } from 'src/app/models/MasterFile.interface';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';
import { ProductService } from 'src/app/services/products/products.service';
import { AngularCsv } from 'angular7-csv';
import { Subscription } from 'rxjs';
import { PointsOfSaleService } from 'src/app/services/pointsOfSale/pointsOfSale.service';

@Component({
    selector: 'app-table-third-step',
    templateUrl: 'table-third-step.component.html',
    styleUrls: ['./table-third-step.component.scss']
})

export class ThirdStepTableComponent implements OnInit, OnChanges {

    @Input() registry;
    @Input() traders;

    @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
    @Output() downloadCSV: EventEmitter<any> = new EventEmitter();
    @Output() previousStep: EventEmitter<any> = new EventEmitter();
    @Output() loadedMasterfile: EventEmitter<any> = new EventEmitter();

    dataSource: MatTableDataSource<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    /**
   * Columnas para configuracion de masterfile
   */
    displayedColumns: String[] = ['id', 'startLoadingDate', 'user', 'master', 'fileUploaded', 'state', 'detail'];

    masterFileCollection = [];
    pointsOfSaleCollection = [];
    productsCollection = [];

    selectedMaster;

    idForPointsOfSale;
    idForProducts;

    private masterSub: Subscription;
    private retailersSubs: Subscription;
    private productsSubs: Subscription;

    constructor(
        private masterFileService: MasterFileService,
        private productService: ProductService,
        private pointsOfSaleService: PointsOfSaleService
    ) { }


    ngOnChanges(changes: SimpleChanges) {
        if (!!changes) {
            let changeTraders = changes['traders'];
            let changeRegistry = changes['registry'];
            if (!!changeTraders) {
                // check si hay cambios en el primer registro seleccionado o en la cantidad de socios comerciales
                if (!!changeTraders.currentValue) {
                    // console.log(changeTraders.currentValue);
                }
            } if (!!changeRegistry) {
                if (!!changeRegistry.currentValue) {
                    // check para asignacion de ID de busqueda para productos dependiendo si hay una configuracion establecida o no
                    if (!changeRegistry.currentValue.idAlliedCompanyConfig) {
                        this.idForProducts = changeRegistry.currentValue.company.companyCode;
                    } else {
                        let searchParams = {
                            idCompany: changeRegistry.currentValue.company.companyCode,
                            idAlliedCompanyConfig: changeRegistry.currentValue.idAlliedCompanyConfig
                        }
                        this.fetchMasterFile(searchParams.idAlliedCompanyConfig);
                        this.idForProducts = searchParams;
                    }
                }
            }
        }
    }

    ngOnInit() {
        this.updateDatable(this.masterFileCollection);
    }

    /**
    * Llamar archivos masterfile
    */
    fetchMasterFile(companyConfigId) {
        this.masterFileService.getMasterFiles(companyConfigId);
        this.masterSub = this.masterFileService.getMasterFileListener().subscribe((data) => {
            this.masterFileCollection = data.masterFiles;
            console.log(this.masterFileCollection);
            setTimeout(() => this.updateDatable(this.masterFileCollection), 1000);
        });
    }

    /**
     * Llamar puntos de venta
     */
    fetchPointsOfSale() {
        this.pointsOfSaleService.getPointsOfSale(this.idForPointsOfSale);
        this.retailersSubs = this.pointsOfSaleService.getPointsOfSaleListener().subscribe((pointsOfSaleData) => {
            this.pointsOfSaleCollection = pointsOfSaleData.pointsOfSale;
        })
    }

    /**
     * LLamar productos
     */
    fetchProducts() {
        if (typeof this.idForProducts === 'object' && !!this.idForProducts) {
            this.productService.getProductsByConfigAndCompany(this.idForProducts.idCompany, this.idForProducts.idAlliedCompanyConfig);
            this.productsSubs = this.productService.getProductListener().subscribe((productData) => {
                this.productsCollection = productData.products;
            })
        } else {
            this.productService.getProductsByCompany(this.idForProducts);
            this.productsSubs = this.productService.getProductListener().subscribe((productData) => {
                this.productsCollection = productData.products;
            });
        }
    }

    handleMasterfile(objMasterfile) {
        if (this.selectedMaster === 'PR') {
            let obj = {
                ...objMasterfile,
                master: 'PRODUCTS',
                idRoute: 2,
            }
            this.loadedMasterfile.emit(obj);
        }
        else if (this.selectedMaster === 'PV') {
            let obj = {
                ...objMasterfile,
                master: 'POINTS_SALE',
                idRoute: 3,
            }
            this.loadedMasterfile.emit(obj);
        } else {
            return;
        }
    }

    updateDatable(dataSource) {
        console.log(dataSource);
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    changeMaster(master) {
        if (master === 'PR') {
            this.selectedMaster = 'PR';
        }
        else if (master === 'PV') {
            this.selectedMaster = 'PV';
        } else {
            return;
        }
    }

    downloadDetailCsv(masterfile){

    }

    exportCsv() {
        if (this.selectedMaster === 'PR') {
            this.fetchProducts();
            setTimeout(() => new AngularCsv(this.productsCollection, 'Reporte Productos'),
                500);

        } else {
            this.fetchPointsOfSale();
            setTimeout(() => {
                new AngularCsv(this.pointsOfSaleCollection, 'Reporte Puntos de Venta');
            }, 500);
        }
    }

    /**
    * Ir al paso anterior
    */
    goToPreviousStep() {
        this.previousStep.emit(true);
    }

    ngOnDestroy(): void {
        this.masterSub.unsubscribe();
        this.retailersSubs.unsubscribe();
        this.productsSubs.unsubscribe();
    }
}