import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/products/products.service';
import { Subscription } from 'rxjs';
import { PointsOfSaleService } from 'src/app/services/pointsOfSale/pointsOfSale.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import * as _ from 'lodash';
import { ModalLoadingComponent } from '../modal-loading-spinner/modal-loading-spinner.component';

@Component({
    selector: 'app-table-third-step',
    templateUrl: 'table-third-step.component.html',
    styleUrls: ['./table-third-step.component.scss']
})


export class ThirdStepTableComponent implements OnInit, OnChanges, OnDestroy {

    @Input() registry;
    @Input() traders;
    @Input() configurationDone;

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
    pointSaleCollection = [];
    productsCollection = [];
    tradersCollection = [];

    selectedMaster;

    idForPointsOfSale;
    idForProducts;
    decodedData;

    searchParams;
    idToRefresh;

    private masterSub: Subscription;
    private pointSaleSub: Subscription;
    private productsSubs: Subscription;

    constructor(
        private configService: ConfigService,
        private productService: ProductService,
        private pointsOfSaleService: PointsOfSaleService,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
    ) { }


    ngOnChanges(changes: SimpleChanges) {
        if (!!changes) {
            const changeTraders = changes['traders'];
            const changeRegistry = changes['registry'];
            const changeConfiguration = changes['configurationDone'];
            if (!!changeTraders) {
                // check si hay cambios en el primer registro seleccionado o en la cantidad de socios comerciales
                if (!!changeTraders.currentValue) {
                    this.tradersCollection = changeTraders.currentValue;
                }
            } if (!!changeRegistry) {
                if (!!changeRegistry.currentValue) {
                    // check para asignacion de ID de busqueda para productos dependiendo si hay una configuracion establecida o no
                    if (!changeRegistry.currentValue.idAlliedCompanyConfig) {
                        this.idForProducts = changeRegistry.currentValue.company.companyCode;
                    } else if (!!changeRegistry.currentValue.idAlliedCompanyConfig) {
                        this.searchParams = {
                            idCompany: changeRegistry.currentValue.company.companyCode,
                            idAlliedCompanyConfig: changeRegistry.currentValue.idAlliedCompanyConfig
                        };
                        this.fetchMasterFile(this.searchParams.idAlliedCompanyConfig);
                    }
                }
            }
            if (!!changeConfiguration) {
                if (!!changeConfiguration.currentValue) {
                    if (!!changeConfiguration.currentValue.idAlliedCompanyConfig) {
                        this.searchParams = {
                            idCompany: changeConfiguration.currentValue.company,
                            idAlliedCompanyConfig: changeConfiguration.currentValue.idAlliedCompanyConfig
                        };
                        // this.searchParams.idAlliedCompanyConfig = changeConfiguration.currentValue.idAlliedCompanyConfig;
                        this.idToRefresh = changeConfiguration.currentValue.idAlliedCompanyConfig;
                        this.fetchMasterFile(changeConfiguration.currentValue.idAlliedCompanyConfig);
                    }
                }
            }
        }
    }

    ngOnInit() {
        this.updateDatable(this.masterFileCollection);
        this.pointSaleSub = new Subscription;
        this.productsSubs = new Subscription;
        this.masterSub = new Subscription;
    }

    /**
    * Llamar archivos masterfile
    */
    fetchMasterFile(companyConfigId) {
        this.configService.getMasterFiles(companyConfigId);
        this.masterSub = this.configService.getMasterFileListener().subscribe((data) => {
            this.masterFileCollection = data.masterFiles;
            this.updateDatable(this.masterFileCollection);
        });
    }

    /**
     * Llamar puntos de venta
     */
    fetchPointsOfSale() {
        this.pointsOfSaleService.getPointsOfSale(this.idForPointsOfSale);
        this.pointSaleSub = this.pointsOfSaleService.getPointsOfSaleListener().subscribe((pointsOfSaleData) => {
            this.pointSaleCollection = pointsOfSaleData.pointsOfSale;
        });
    }

    handleMasterfile(objMasterfile) {
        if (this.selectedMaster === 'PR') {
            const obj = {
                ...objMasterfile,
                master: 'PRODUCTS',
                idRoute: 2,
            };
            this.loadedMasterfile.emit(obj);
        } else if (this.selectedMaster === 'PV') {
            const obj = {
                ...objMasterfile,
                master: 'POINTS_SALE',
                idRoute: 3,
            };
            this.loadedMasterfile.emit(obj);
        } else {
            return;
        }
    }

    updateDatable(dataSource) {
        this.dataSource = new MatTableDataSource<any>(dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = _.get;
        this.dataSource.sort = this.sort;
    }

    changeMaster(master) {
        if (master === 'PR') {
            this.selectedMaster = 'PR';
        } else if (master === 'PV') {
            this.selectedMaster = 'PV';
        } else {
            return;
        }
    }

    downloadDetailCsv(masterfile) {
        this.configService.getLogMasterFile(masterfile).subscribe((encodedData) => {
            if (encodedData === null) {
                this._snackBar.open('El archivo no está disponible', 'cerrar', {
                    duration: 2000,
                });
            } else {
                const logFileName = 'CenC_' + masterfile.fileName + '_log.csv';
                this.exportToCsv(encodedData, logFileName);
            }
        });
    }

    exportToCsv(data, name) {
        const dataType = data.type;
        const binaryData = [];
        binaryData.push(data);

        const filePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        document.body.appendChild(downloadLink);
        downloadLink.setAttribute('download', name);
        downloadLink.click();
    }

    handleRefresh() {
        if (this.searchParams.idAlliedCompanyConfig) {
            this.fetchMasterFile(this.searchParams.idAlliedCompanyConfig);
        } else {
            this.fetchMasterFile(this.idToRefresh);
        }
    }

    exportCsv() {
        if (this.selectedMaster === 'PR') {
            if (!!this.searchParams) {
                this.openModal();
                this.productService.getProductsByConfigAndCompany(this.searchParams.idCompany, this.searchParams.idAlliedCompanyConfig);
                this.productsSubs = this.productService.getProductListener().subscribe((productData) => {
                    this.dialog.closeAll();
                    this.productsCollection = productData.products;

                    const options = {
                        quoteStrings: '',
                        headers: ['Id Producto', 'EAN Producto', 'Descripción', 'Estado']
                    };

                    new AngularCsv(this.productsCollection, 'Reporte Productos', options);
                });
            } else {
                this.openModal();
                this.productService.getProductsByCompany(this.idForProducts);
                this.productsSubs = this.productService.getProductListener().subscribe((productData) => {
                    this.dialog.closeAll();
                    this.productsCollection = productData.products;
                    const options = {
                        quoteStrings: '',
                        headers: ['Id Producto', 'EAN Producto', 'Descripción', 'Estado']
                    };
                    new AngularCsv(this.productsCollection, 'Reporte Productos', options);
                });
            }

        } else if (this.selectedMaster === 'PV') {
            if (!!this.searchParams) {
                if (this.searchParams.idAlliedCompanyConfig) {
                    this.openModal();
                    this.pointsOfSaleService.getPointsOfSale(this.searchParams.idAlliedCompanyConfig);
                    this.pointSaleSub = this.pointsOfSaleService.getPointsOfSaleListener().subscribe((pointSaleData) => {
                        this.dialog.closeAll();
                        this.pointSaleCollection = pointSaleData.pointsOfSale;
                        const options = {
                            quoteStrings: '',
                            headers: ['Id Punto de Venta', 'EAN', 'Punto de Venta', 'Código Comercio', 'Comercio', 'Estado']
                        };
                        new AngularCsv(this.pointSaleCollection, 'Reporte Puntos de Venta', options);
                    });
                }
            } else {
                this.openModal();
                this.pointsOfSaleService.postTradersToGetPointSale(this.tradersCollection).subscribe((pointSaleData) => {
                    this.dialog.closeAll();
                    const options = {
                        quoteStrings: '',
                        headers: ['Id Punto de Venta', 'EAN', 'Punto de Venta', 'Código Comercio', 'Comercio', 'Estado']
                    };
                    new AngularCsv(pointSaleData, 'Reporte Puntos de Venta', options);
                });
            }
        }
    }

    openModal() {
        const dialogRef = this.dialog.open(ModalLoadingComponent, {
            panelClass: 'spinner-dialog',
            height: '250px',
        });
    }
    /**
    * Ir al paso anterior
    */
    goToPreviousStep() {
        this.previousStep.emit(true);
    }

    ngOnDestroy(): void {
        if (this.masterSub || this.pointSaleSub || this.productsSubs) {
            this.masterSub.unsubscribe();
            this.pointSaleSub.unsubscribe();
            this.productsSubs.unsubscribe();
        }
    }
}
