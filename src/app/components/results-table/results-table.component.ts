import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { ModalDescriptionComponent } from '../modal-description/modal-description.component';
import { ModalConfigFormComponent } from '../modal-config-form/modal-config-form.component';
import * as _ from 'lodash';
import { AuditService } from 'src/app/services/audit/audit.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.scss'],
})

export class ResultsTableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  /**
  * Allies es el pais del que se tiene que hacer el fetch
  */
  @Input() allies;
  @Input() filteredAlly;
  @Input() filteredCompany;
  @Input() registry;
  @Input() configurationDone;
  @Input() cleanRegister;


  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() nextStepWithRegistry: EventEmitter<any> = new EventEmitter();
  @Output() createAllyCompanyConfig: EventEmitter<any> = new EventEmitter();
  @Output() auditCreated: EventEmitter<any> = new EventEmitter();


  private allySub: Subscription;
  private companyAllyConfigSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * Fuente de informacion de la tabla para paginacion, filtrado y sorteado
   */
  dataSource: MatTableDataSource<any>;

  displayedColumns = ['idAlliedCompanyConfig', 'selectField', 'allied.idAllied', 'allied.name', 'company.companyCode',
    'company.companyName', 'configurationDate', 'state.state'];
  /**
   * Colecciones
   */
  private configAllyCompanyToActivateOrDeactivate = [];
  private companyConfigCollection = [];

  /**
   * Client
   */
  private clientIp;

  /**
   * Registro Selecionado
   */
  selectedRecord;

  /**
   * Collecion de configuraciones
   */
  configOne;

  /**
   * Depedencia de modal
   * @param dialog modal
   */
  constructor(
    private dialog: MatDialog,
    private allyService: AliadoService,
    private auditService: AuditService,
    private companyConfigService: ConfigService,
    private _snackBar: MatSnackBar
  ) { }

  /**
   * Si es tabla uno y hay un objeto de aliados como input revisar si es de un solo pais o de todos
   */
  ngOnChanges(changes: SimpleChanges) {
    const configurationDone = changes['configurationDone'];
    const registry = changes['registry'];
    const cancelled = changes['cleanRegister'];

    if (!this.filteredAlly && !this.filteredCompany) {
      // Fetch de aliados y empresas para creacion de configuraciones
    } else if (!!this.filteredAlly && !this.filteredCompany) {
      this.fetchConfigsWithNoCompany(this.filteredAlly);
    } else if (!!this.filteredAlly && !!this.filteredCompany) {
      this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);

    } else if (!!configurationDone) {
      if (!!configurationDone.currentValue) {
        if (!!configurationDone.currentValue.isDone) {
          this.selectedRecord = [];
          this.fetchConfigsWithAllyAndCompany(configurationDone.currentValue.ally, configurationDone.currentValue.company);
        }
      }
    } if (registry) {
      if (registry.currentValue) {
        this.updateDatable(this.companyConfigCollection);
      }
    }
    if (cancelled) {
      if (cancelled.currentValue) {
        if (!this.filteredAlly && !this.filteredCompany) {
          this.companyConfigCollection = [];
          this.updateDatable(this.companyConfigCollection);
        } else if (!!this.filteredAlly && !this.filteredCompany) {
          this.fetchConfigsWithNoCompany(this.filteredAlly);
        } else if (!!this.filteredAlly && !!this.filteredCompany) {
          this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
        }
      }
    }
  }

  /**
   * Opciones de tabla + asignacion de data a la tabla
   */
  ngOnInit() {
    this.fetchAllConfigs();
    this.allyService.getIp();
    this.allySub = this.allyService.getIpListener().subscribe((data) => {
      this.clientIp = data.ip;
    });
  }

  ngAfterViewInit() {
    this.updateDatable(this.companyConfigCollection);
  }
  /**
   * Actualizar tabla
   */
  updateDatable(dataSource) {
    this.dataSource = new MatTableDataSource<any>(dataSource);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por página';
    this.dataSource.sortingDataAccessor = _.get;
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
   * Modal para agregar configuracion de envio de la informacion
   */
  addComercialRelation() {
    const dialogRef = this.dialog.open(ModalConfigFormComponent, {
      width: '25%',
    });
    dialogRef.afterClosed().subscribe((configRelation) => {
      if (!!configRelation) {
        this.configOne = configRelation.configOne;
        this.companyConfigCollection.push(configRelation.registryToPush);
        this.dataSource = new MatTableDataSource<any>(this.companyConfigCollection);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  fetchAllConfigs() {
    this.companyConfigService.getAllAllyCompanyConfig();
    this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
      this.companyConfigCollection = data.companyConfig;
      const filteredCollection = this.companyConfigCollection.filter((item) => item.allied.idState !== 4);
      this.updateDatable(filteredCollection);
    });
  }
  /**
   * Llamar configuracion de de compania por aliado
   * @param idAlly id aliado
   */
  fetchConfigsWithNoCompany(idAlly) {
    this.companyConfigService.getAllyCompanyConfiguration(idAlly);
    this.companyAllyConfigSub = this.companyConfigService.getAllyCompanyConfigListener().subscribe((data) => {
      this.companyConfigCollection = data.companyConfig;
      const filteredCollection = this.companyConfigCollection.filter((item) => item.allied.idState !== 4);
      this.updateDatable(filteredCollection);
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
      this.companyConfigCollection = data.companyConfig;
      const filteredCollection = this.companyConfigCollection.filter((item) => item.allied.idState !== 4);
      this.updateDatable(filteredCollection);
      this.isLoading.emit(false);
    });
  }

  /**
   * Activar alianza comercial
   */
  activateOrDeactivateComercialRelation() {
    const registry = this.configAllyCompanyToActivateOrDeactivate;
    registry.forEach(configAllyCompany => {
      const activateRelations = [{
        idAlliedCompanyConfig: configAllyCompany.idAlliedCompanyConfig,
        allied: { idAllied: configAllyCompany.allied.idAllied },
        state: { idState: 1 },
        company: { idCompany: configAllyCompany.company.idCompany },
        configurationDate: configAllyCompany.configurationDate
      }];

      const deactivateRelations = [{
        idAlliedCompanyConfig: configAllyCompany.idAlliedCompanyConfig,
        allied: { idAllied: configAllyCompany.allied.idAllied },
        state: { idState: 2 },
        company: { idCompany: configAllyCompany.company.idCompany },
        configurationDate: configAllyCompany.configurationDate
      }];

      if (configAllyCompany.state.idState === 1) {
        this.companyConfigService.activateOrDeactivateComercialRelation(deactivateRelations).subscribe(() => {
          this.configAllyCompanyToActivateOrDeactivate = [];
          this.handleAuditAllyCompanyConfig(deactivateRelations);
          if (!!this.filteredAlly && !this.filteredCompany) {
            this.fetchConfigsWithNoCompany(this.filteredAlly);
          } else if (!!this.filteredAlly && !!this.filteredCompany) {
            this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
          }
        });
      } else {
        this.companyConfigService.activateOrDeactivateComercialRelation(activateRelations).subscribe(() => {
          this.configAllyCompanyToActivateOrDeactivate = [];
          this.handleAuditAllyCompanyConfig(activateRelations);
          if (!!this.filteredAlly && !this.filteredCompany) {
            this.fetchConfigsWithNoCompany(this.filteredAlly);
          } else if (!!this.filteredAlly && !!this.filteredCompany) {
            this.fetchConfigsWithAllyAndCompany(this.filteredAlly, this.filteredCompany);
          }
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
          actionExecuted: 'Activacion',
          executor: 'ivan hernandez',
          ipOrigin: this.clientIp,
          configurationDate: configAllyCompElement.configurationDate,
          updateDate: updateDate
        };
        this.createAudit(configAudit);
      } else if (configAllyCompElement.state.idState === 2) {

        const configAudit = {
          idAlliedCompanyConfAudit: null,
          allied: { idAllied: configAllyCompElement.allied.idAllied },
          state: { idState: configAllyCompElement.state.idState },
          company: { idCompany: configAllyCompElement.company.idCompany },
          actionExecuted: 'Desactivacion',
          executor: 'ivan hernandez',
          ipOrigin: this.clientIp,
          configurationDate: configAllyCompElement.configurationDate,
          updateDate: updateDate
        };
        this.createAudit(configAudit);
      }
    });
    this.createAllyCompanyConfig.emit(true);
  }

  createAudit(objAudit) {
    this.auditService.creatAllyCompanyConfig(objAudit).subscribe();
  }

  handleCheck(event: MatCheckboxChange, config) {
    if (event.checked) {
      this.configAllyCompanyToActivateOrDeactivate.push(config);
    } else {
      for (let i = this.configAllyCompanyToActivateOrDeactivate.length - 1; i >= 0; --i) {
        if (this.configAllyCompanyToActivateOrDeactivate[i].idAllied === config.idAllied) {
          this.configAllyCompanyToActivateOrDeactivate.splice(i, 1);
        }
      }
    }
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
        } else {
          this.showMessage('Operación cancelada');
        }
      });
    } else if (!registry.idAlliedCompanyConfig) {
      this.selectedRecord = registry;
      const dialogRef = this.dialog.open(ModalDescriptionComponent, {
        width: '30%',
        height: '250px',
        data: { deleting: false, cancelling: false, configurating: true, registry: registry }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.configurating === true) {
          this.nextStepWithRegistry.emit(result.registry);
        } else {
          this.showMessage('Operación cancelada');
        }
      });
    } else {
      this.showMessage('Configuración inactiva');
    }
  }

  showMessage(message) {
    this._snackBar.open(message, 'cerrar', {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    if (this.companyAllyConfigSub || this.allySub) {
      this.companyAllyConfigSub.unsubscribe();
      this.allySub.unsubscribe();
    }
  }

}
