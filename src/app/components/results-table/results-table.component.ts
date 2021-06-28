import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ProductService } from 'src/app/services/products/products.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { MasterFileService } from 'src/app/services/masterfile/masterfile.service';
import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalAllyFormComponent } from '../modal-ally-form/modal-ally-form.component';
import { ModalConfigFormComponent } from '../modal-config-form/modal-config-form.component';
import { AngularCsv } from 'angular7-csv';
import { MasterFile } from 'src/app/models/MasterFile.interface';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnInit, OnChanges {
  /**
  * Allies es el pais del que se tiene que hacer el fetch
  */
  @Input() allies;
  @Input() filteredAlly;
  @Input() filteredCompany;
  @Input() registry;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() nextStepWithRegistry: EventEmitter<any> = new EventEmitter();


  private allySub: Subscription;
  private companySub: Subscription;
  private companyAllyConfigSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;
  dataSourceMaster: MatTableDataSource<MasterFile>;

  displayedColumns: string[];
  /**
   * Columnas para tabla de configuracion de aliados
   */
  allyConfigColumns = ['idAllied', 'creationDate', 'channel', 'route', 'idCountry', 'name',
    'identification', 'contact', 'mail', 'phone', 'description', 'carvajalContact',
    'actions'];
  /**
   * Columnas para configuracion de empresa
   */
  firstConfigColumns = ['idAlliedCompanyConfig', 'selectField', 'allied.idAllied', 'allied.name', 'company.idCompany', 'company.companyCode', 'company.companyName', 'configurationDate', 'state']
  /**
   * Colecciones 
   */
  allyCollection = [];
  companyCollection = [];
  companyCollectionToCreateAlliance = [];
  configAllyCompanyToActivateOrDeactivate = [];
  companyConfigCollection = [];
  ProductCollection = [];
  MasterFileCollection = [];
  /**
   * Collecion de configuraciones
   */
  configOne;
  companyId = 626;
  idAlliedCompanyConfig = 200;
  /**
   * Para condicionar de que componenente se trata
   * 1 = Configuracion aliado
   * 2 = Configuracion socio comercial
   * 3 = Configuracion empresa
   * 4 = Configuracion productos
   * 5 = Trazabilidad
   */
  @Input() tableNumber: number;
  /**
   * Depedencia de modal
   * @param dialog modal
   */
  constructor(
    public dialog: MatDialog,
    private allyService: AliadoService,
    private companyService: CompanyService,
    private productService: ProductService,
    private companyConfigService: ConfigService,
    private masterFileService: MasterFileService,
    private _snackBar: MatSnackBar
  ) { }
  
  /**
   * Si es tabla uno y hay un objeto de aliados como input revisar si es de un solo pais o de todos
   */
  ngOnChanges() {
    // Tabla 1 configuracion de aliados, hay objeto aliado y no hay ningun aliado filtrado
    if (this.tableNumber === 1 && !!this.allies && !this.filteredAlly) {
      // Todos los paises
      if (this.allies === 'ALL') {
        this.allyService.getAllies();
        this.allySub = this.allyService.getAllyListener().subscribe((allyData) => {
          this.isLoading.emit(false);
          this.allyCollection = allyData.allies;
          this.updateDatable(this.allyCollection);
          this.displayedColumns = this.allyConfigColumns;
        })
      }
      else {
        // Hay aliado filtrado por pais
        this.allyService.getAllyByCountry(this.allies);
        this.allySub = this.allyService.getAllyListener()
          .subscribe((allyData) => {
            this.filteredAlly = null;
            this.isLoading.emit(false);
            this.allyCollection = allyData.allies;
            this.updateDatable(this.allyCollection);
            this.displayedColumns = this.allyConfigColumns;
          });
      }
    }
    // Configuracion de aliado si hay un aliado filtrado
    else if (this.tableNumber === 1 && !!this.filteredAlly) {
      const filtered = this.allyCollection.filter(ally => ally.idAllied == this.filteredAlly);
      this.updateDatable(filtered);
      this.filteredAlly = null;
      this.displayedColumns = this.allyConfigColumns;
    }
    // Configuracion de Envio de informacion paso 1
       if (this.tableNumber === 2 && !this.filteredAlly && !this.filteredCompany) {
      // Fetch de aliados y empresas para creacion de configuraciones
      this.allyService.getAllies();
      this.allySub = this.allyService.getAllyListener().subscribe((data) => {
        this.allyCollection = data.allies;
        this.companyService.getCompanies();
        this.companySub = this.companyService.getCompanyListener().subscribe((data) => {
          this.companyCollection = data.companies;
        });
        this.companyConfigService.getAllAllyCompanyConfig();
        this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data)=> {
          this.companyCollection = data.companyConfig;          
          this.updateDatable(this.companyCollection);
          this.displayedColumns = this.firstConfigColumns;

        })
      });
    }
    else if (this.tableNumber === 2 && !!this.filteredAlly && !this.filteredCompany) {
      this.companyConfigService.getAllyCompanyConfiguration(this.filteredAlly);
      this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
        this.companyConfigCollection = data.companyConfig
        this.updateDatable(data.companyConfig)
        this.displayedColumns = this.firstConfigColumns;
        this.isLoading.emit(false);
      })
      // Configuracion de empresa 1  si hay aliado  y empresa filtrados
    } else if (this.tableNumber === 2 && !!this.filteredAlly && !!this.filteredCompany) {
      this.companyConfigService.getAllyCompanyConfigurationByCompanyAndAlly(this.filteredAlly, this.filteredCompany);
      this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
        this.companyConfigCollection = data.companyConfig
        this.dataSource = new MatTableDataSource<any>(this.companyConfigCollection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = this.firstConfigColumns;
        this.isLoading.emit(false);
      });

    }
    // Configuracion de empresa 2 con registro seleccionado en paso 1
    if (this.tableNumber === 3) {
      console.log(this.allies);
      this.masterFileService.getMasterFiles(this.idAlliedCompanyConfig);
      this.masterFileService.getMasterFileListener().subscribe((data) => {
        this.MasterFileCollection = data.masterFiles
        this.dataSourceMaster = new MatTableDataSource<MasterFile>(this.MasterFileCollection);
        this.dataSourceMaster.paginator = this.paginator;
        this.dataSourceMaster.sort = this.sort;
        this.isLoading.emit(false);
      });
    }
  }
  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    if (this.tableNumber === 1 && this.allies) {
      this.dataSource = new MatTableDataSource<any>(this.allyCollection);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else if (this.tableNumber === 2) {
    this.dataSource = new MatTableDataSource<any>(this.companyConfigCollection);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  /**
   * Actualizar tabla
   */
  updateDatable(dataSource) {
    this.dataSource = new MatTableDataSource<any>(dataSource);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /**
  * Abrir Modal para ver descripcion de aliado
  * @param description Descripcion de aliado
  */
  openDialog(description): void {
    const dialogRef = this.dialog.open(ModalDescriptionComponent, {
      width: '25%',
      data: { description: description }
    });
  }
  /**
   * Emite como output el aliado modificado y sin modificar para hacer comparacion en configuracion de aliados
   * @param selectedAlly Aliado a modificar
   */
  editAlly(selectedAlly): void {
    const dialogRef = this.dialog.open(ModalAllyFormComponent, {
      width: '50%',
      data: { ally: selectedAlly }
    });

    dialogRef.afterClosed().subscribe((modifiedAlly) => {
      if (!!modifiedAlly) {
        modifiedAlly = {
          ...modifiedAlly,
          channel: { idChannel: selectedAlly.channel.idChannel },
          route: { idRoute: selectedAlly.route.idRoute }
        };
        this.editedAlly.emit({ modifiedAlly, selectedAlly });
      }
      else {
        this._snackBar.open('Operacion Cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }
  /**
   * Modal para agregar configuracion de envio de la informacion
   */
  addComercialRelation() {
    const dialogRef = this.dialog.open(ModalConfigFormComponent, {
      width: '50%',
      data: { allyCollection: this.allyCollection, companyCollection: this.companyCollection }
    });
    dialogRef.afterClosed().subscribe((configRelation) => {
      if (!!configRelation) {
        this.configOne = configRelation.configOne;
        this.companyConfigCollection.push(configRelation.registryToPush);
        this.dataSource = new MatTableDataSource<any>(this.companyConfigCollection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayedColumns = this.firstConfigColumns;
      }
    });
  }
  /**
 * Registra objectos chequeados en objeto que se guarda en memoria local hasta que se active el registro
 * @param registry array de registros de la tabla seleccionados
 */
  handleCheck(event: MatCheckboxChange, registry) {
    if (event.checked) {
      this.configAllyCompanyToActivateOrDeactivate.push(registry);
    }
    else {
      this.configAllyCompanyToActivateOrDeactivate.forEach(registryInCollection => {
        this.configAllyCompanyToActivateOrDeactivate.splice(registryInCollection, 1)
      });
    }
  }

  /**
   * Activar alianza comercial
   */
  activateOrDeactivateComercialRelation() {

    const registry = this.configAllyCompanyToActivateOrDeactivate;
    registry.forEach(configAllyCompany => {

      if (configAllyCompany.state.idState === 1) {
        const deactivateRelations = [{
          idAlliedCompanyConfig: configAllyCompany.idAlliedCompanyConfig,
          allied: { idAllied: configAllyCompany.allied.idAllied },
          state: { idState: 2 },
          company: { idCompany: configAllyCompany.company.idCompany },
          configurationDate: configAllyCompany.configurationDate
        }]

        this.companyConfigService.activateOrDeactivateComercialRelation(deactivateRelations);
        this.dataSource.sort = this.sort;

      } else {
        const activateRelations = [{
          idAlliedCompanyConfig: configAllyCompany.idAlliedCompanyConfig,
          allied: { idAllied: configAllyCompany.allied.idAllied },
          state: { idState: 1 },
          company: { idCompany: configAllyCompany.company.idCompany },
          configurationDate: configAllyCompany.configurationDate
        }]
        this.companyConfigService.activateOrDeactivateComercialRelation(activateRelations);
        this.dataSource.sort = this.sort;

      }
    });

    this.companyConfigService.getAllyCompanyConfigListener();

  }
  /**
   * Abre modal para confirmar que se quiere confirmar registro y permite pasar al siguiente paso de configuracion
   */
  goToConfiguration(registry) {
    // console.log(registry);
    const dialogRef = this.dialog.open(ModalDescriptionComponent, {
      width: '30%',
      data: { deleting: false, cancelling: false, configurating: true, registry: registry }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(result.configurating);
      if (result.configurating === true) {
        this.nextStepWithRegistry.emit(result.registry);
      }
      else {
        this._snackBar.open('Operacion Cancelada', 'cerrar', {
          duration: 2000,
        });
      }
    });
  }
  /**
   * Output de el aliado a eliminar
   * @param idAllied Id de Aliado que sera eliminado
   */
  deleteAlly(ally) {
    this.deletedAlly.emit(ally);
  }
  
  exportCsv() {
    this.productService.getProductsByCompany(this.companyId);
    this.productService.getProductListener().subscribe((data) => {
      console.info(data.products);
      new AngularCsv(data.products, 'Reporte Productos');
    });

  }

}
