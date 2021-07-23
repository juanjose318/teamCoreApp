import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalAllyFormComponent } from '../modal-ally-form/modal-ally-form.component';
import { ModalConfigFormComponent } from '../modal-config-form/modal-config-form.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnInit, OnChanges, AfterViewInit {
  /**
  * Allies es el pais del que se tiene que hacer el fetch
  */
  @Input() allies;
  @Input() filteredAlly;
  @Input() filteredCompany;
  @Input() registry;
  @Input() configurationDone;

  @Output() deletedAlly: EventEmitter<any> = new EventEmitter();
  @Output() editedAlly: EventEmitter<any> = new EventEmitter();
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() nextStepWithRegistry: EventEmitter<any> = new EventEmitter();
  @Output() createAllyCompanyConfig: EventEmitter<any> = new EventEmitter();


  private allySub: Subscription;
  private allySubForConfiguration: Subscription;
  private companySub: Subscription;
  private companyAllyConfigSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[];
  /**
   * Columnas para tabla de configuracion de aliados
   */
  allyConfigColumns = ['idAllied', 'creationDate', 'channel.channel', 'route.route', 'idCountry', 'name',
    'identification', 'contact', 'mail', 'phone', 'description', 'carvajalContact',
    'actions'];
  /**
   * Columnas para configuracion de empresa
   */
  firstConfigColumns = ['idAlliedCompanyConfig', 'selectField', 'allied.idAllied', 'allied.name', 'company.companyCode', 'company.companyName', 'configurationDate', 'state.state']
  /**
   * Colecciones 
   */
  private allyCollection = [];
  private companyCollection = [];
  private companyCollectionToCreateAlliance = [];
  private configAllyCompanyToActivateOrDeactivate = [];
  private companyConfigCollection = [];
  private allyCollectionForConfiguration = [];

  /**
   * Client
   */
  private clientIp;

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
   * 4 = Configuracion productos
   */
  @Input() tableNumber: number;

  configAudit = {
    
  }

  /**
   * Depedencia de modal
   * @param dialog modal
   */
  constructor(
    public dialog: MatDialog,
    private allyService: AliadoService,
    private companyService: CompanyService,
    private companyConfigService: ConfigService,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Si es tabla uno y hay un objeto de aliados como input revisar si es de un solo pais o de todos
   */
  ngOnChanges(changes: SimpleChanges) {
    let configurationDone = changes['configurationDone'];
    // Tabla 1 configuracion de aliados, hay objeto aliado y no hay ningun aliado filtrado
    if (this.tableNumber === 1 && !!this.allies && !this.filteredAlly) {
      // Todos los paises
      if (this.allies === 'ALL') {
        this.fetchAllAllies();
        this.updateDatable(this.allyCollection);
        this.displayedColumns = this.allyConfigColumns;
      }
      else {
        // Hay aliado filtrado por pais
        this.allyService.getAllyByCountry(this.allies);
        this.allySub = this.allyService.getAllyListener()
          .subscribe((allyData) => {
            this.filteredAlly = null;
            this.isLoading.emit(false);
            this.allyCollection = allyData.allies;
            this.displayedColumns = this.allyConfigColumns;
            this.updateDatable(this.allyCollection);
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
    if (this.tableNumber === 2) {
      if (!this.filteredAlly && !this.filteredCompany) {
        // Fetch de aliados y empresas para creacion de configuraciones
      }
      else if (!!this.filteredAlly && !this.filteredCompany) {
        this.fetchConfigsWithNoCompany(this.filteredAlly);
        this.updateDatable(this.companyConfigCollection);
      }
      // Configuracion de empresa 1  si hay aliado  y empresa filtrados
      else if (!!this.filteredAlly && !!this.filteredCompany) {
        this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
        this.updateDatable(this.companyConfigCollection);
      }
      else if (!!configurationDone) {
        if (!!configurationDone.currentValue) {
          if (!!configurationDone.currentValue.isDone) {
            this.fetchConfigsWithAllyAndCompany(configurationDone.currentValue.ally, configurationDone.currentValue.company);
            this.updateDatable(this.companyConfigCollection);
          }
        }
      }
      this.fetchAllAllies();
      this.fetchAllCompanies();
      this.displayedColumns = this.firstConfigColumns;
      this.updateDatable(this.companyConfigCollection);

    }
  }
  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    if (this.tableNumber === 1 && this.allies) {
      this.updateDatable(this.allyCollection);
    }
    else if (this.tableNumber === 2) {
      this.updateDatable(this.companyConfigCollection);
      this.allyService.getIp();
      this.allySub = this.allyService.getIpListener().subscribe((data) => {
        this.clientIp = data.ip
      });
    }
  }

  ngAfterViewInit() {
    if (this.tableNumber === 2) {
      this.updateDatable(this.companyConfigCollection);
    }
  }

  /**
   * Actualizar tabla
   */
  updateDatable(dataSource) {
    this.dataSource = new MatTableDataSource<any>(dataSource);
    this.dataSource.sortingDataAccessor = _.get;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Llamar todos los aliados
   */
  fetchAllAllies() {
    this.allyService.getAllies();
    this.allySub = this.allyService.getAllyListener().subscribe((allyData) => {
      this.isLoading.emit(false);
      this.allyCollection = allyData.allies;
    });
    this.allySubForConfiguration = this.allyService.getAllyListener().subscribe((allyData) => {
      this.allyCollectionForConfiguration = allyData.allies;
    });
  }

  /**
   * Llamar todos las companias
   */
  fetchAllCompanies() {
    this.companyService.getCompanies();
    this.companySub = this.companyService.getCompanyListener().subscribe((data) => {
      this.isLoading.emit(false);
      this.companyCollection = data.companies;
      this.companyCollectionToCreateAlliance = data.companies;
    });
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
      width: '25%',
      data: { allyCollection: this.allyCollectionForConfiguration, companyCollection: this.companyCollectionToCreateAlliance }
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
   * Llamar configuracion de de compania por aliado
   * @param idAlly id aliado
   */
  fetchConfigsWithNoCompany(idAlly) {
    this.companyConfigService.getAllyCompanyConfiguration(idAlly);
    this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
      this.companyConfigCollection = data.companyConfig
      this.updateDatable(data.companyConfig)
      this.displayedColumns = this.firstConfigColumns;
      this.isLoading.emit(false);
    });
  }

  /**
   * Llamar configuraciones usando aliado y compania
   * @param idAlly id de aliado
   * @param idCompany id de compania
   */
  fetchConfigsWithAllyAndCompany(idAlly, idCompany) {
    this.companyConfigService.getAllyCompanyConfigurationByCompanyAndAlly(idAlly, idCompany);
    this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
      this.companyConfigCollection = data.companyConfig
      this.updateDatable(this.companyConfigCollection);
      this.displayedColumns = this.firstConfigColumns;
      this.isLoading.emit(false);
    });
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

        this.companyConfigService.activateOrDeactivateComercialRelation(deactivateRelations).subscribe(() => {
          this.handleAuditAllyCompanyConfig(deactivateRelations);
          if (!!this.filteredAlly && !this.filteredCompany) {
            this.fetchConfigsWithNoCompany(this.filteredAlly);
          }
          // Configuracion de empresa 1  si hay aliado  y empresa filtrados
          else if (!!this.filteredAlly && !!this.filteredCompany) {
            this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
          }

        });
      } else {
        const activateRelations = [{
          idAlliedCompanyConfig: configAllyCompany.idAlliedCompanyConfig,
          allied: { idAllied: configAllyCompany.allied.idAllied },
          state: { idState: 1 },
          company: { idCompany: configAllyCompany.company.idCompany },
          configurationDate: configAllyCompany.configurationDate
        }];

        this.companyConfigService.activateOrDeactivateComercialRelation(activateRelations).subscribe(() => {
          this.handleAuditAllyCompanyConfig(activateRelations);
          if (!!this.filteredAlly && !this.filteredCompany) {
            this.fetchConfigsWithNoCompany(this.filteredAlly);
          }
          // Configuracion de empresa 1  si hay aliado  y empresa filtrados
          else if (!!this.filteredAlly && !!this.filteredCompany) {
            this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
          };
        });
      }
    });
  }
  
  handleAuditAllyCompanyConfig(configAllyComp) {
    const updateDate: Date = new Date();
    configAllyComp.forEach(configAllyCompElement => {

      if (configAllyCompElement.state.idState === 1) {
        const configAudit = {
          idAlliedCompanyConfAudit: null,
          allied: { idAllied: configAllyCompElement.allied.idAllied },
          state: { idState: configAllyCompElement.state.idState },
          company: { idCompany: configAllyCompElement.company.idCompany },
          actionExecuted: "Activacion",
          executor: "ivan hernandez",
          ipOrigin: this.clientIp,
          configurationDate: configAllyCompElement.configurationDate,
          updateDate: updateDate
        }

        this.createAllyCompanyConfig.emit(configAudit);

      } else if (configAllyCompElement.state.idState === 2) {

        const configAudit = {
          idAlliedCompanyConfAudit: null,
          allied: { idAllied: configAllyCompElement.allied.idAllied },
          state: { idState: configAllyCompElement.state.idState },
          company: { idCompany: configAllyCompElement.company.idCompany },
          actionExecuted: "Desactivacion",
          executor: "ivan hernandez",
          ipOrigin: this.clientIp,
          configurationDate: configAllyCompElement.configurationDate,
          updateDate: updateDate
        }

        this.createAllyCompanyConfig.emit(configAudit);

      }
    });
  }

  handleCheck(event: MatCheckboxChange, config) {
    if (event.checked) {
      this.configAllyCompanyToActivateOrDeactivate.push(config);
    }
    else {
      for (let i = this.configAllyCompanyToActivateOrDeactivate.length - 1; i >= 0; --i) {
        if (this.configAllyCompanyToActivateOrDeactivate[i].idAllied == config.idAllied) {
          this.configAllyCompanyToActivateOrDeactivate.splice(i, 1);
        }
      }
    };
  }

  /**
   * Abre modal para confirmar que se quiere confirmar registro y permite pasar al siguiente paso de configuracion
   */
  goToConfiguration(registry) {
    if (registry.state.idState === 1 || (registry.isCanActivate === 0 && registry.state.idState === 2)) {
      const dialogRef = this.dialog.open(ModalDescriptionComponent, {
        width: '30%',
        height: '250px',
        data: { deleting: false, cancelling: false, configurating: true, registry: registry }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.configurating === true) {
          this.nextStepWithRegistry.emit(result.registry);
        }
        else {
          this._snackBar.open('Operación cancelada', 'cerrar', {
            duration: 2000,
          });
        }
      });
    } else if (!registry.idAlliedCompanyConfig) {
      const dialogRef = this.dialog.open(ModalDescriptionComponent, {
        width: '30%',
        height: '250px',
        data: { deleting: false, cancelling: false, configurating: true, registry: registry }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.configurating === true) {
          this.nextStepWithRegistry.emit(result.registry);
        }
        else {
          this._snackBar.open('Operación cancelada', 'cerrar', {
            duration: 2000,
          });
        }
      });
    }
    else {
      this._snackBar.open('Configuración inactiva', 'cerrar', {
        duration: 2000,
      });
    }
  }

  /**
   * Output de el aliado a eliminar
   * @param idAllied Id de Aliado que sera eliminado
   */
  deleteAlly(ally) {
    this.deletedAlly.emit(ally);
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.allySub.unsubscribe();
      this.allySubForConfiguration.unsubscribe();
      this.companySub.unsubscribe();
      this.companyAllyConfigSub.unsubscribe();
    }, 300000);
  }

}
