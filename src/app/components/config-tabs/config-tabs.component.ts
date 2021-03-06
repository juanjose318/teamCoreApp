import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar, MatStepper } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/services/config/config.service';
import { AuditService } from 'src/app/services/audit/audit.service';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { Subscription } from 'rxjs';
import { ModalSaveConfirmationComponent } from '../modal-save-confirmation/modal-save-confirmation.component';


@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss'],
})
export class ConfigTabsComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() selectedAlly;
  @Input() selectedCompany;
  @Input() selectedCountry;
  @Input() cleanConfig;
  @Input() saveConfig;

  @Output() resetStepper: EventEmitter<boolean> = new EventEmitter();
  @Output() OutisLoading: EventEmitter<boolean> = new EventEmitter();
  @Output() saved: EventEmitter<boolean> = new EventEmitter();

  @Output() registry: EventEmitter<any> = new EventEmitter();
  @Output() comercialPartners: EventEmitter<any> = new EventEmitter();
  @Output() uploadedFile: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatStepper) stepper: MatStepper;

  private allySub: Subscription;

  isLoading: boolean;
  // Registro de configuracion seleccionado en paso 1
  registryToConfigure;
  // comercios seleccionados en paso dos
  objTradersConfig;
  // tslint:disable-next-line: max-line-length
  // todos los comercios seleccionados o deseleccionados en base a un idStateTemp que se convierte al id estado dependiendo de la diferencia o similitud de la misma, aplica para paso de edicion
  tradersAfterMod;
  // objeto para la creacion de auditoria
  objAllyCompanyAuditCollection;
  // objeto de traders para ser usado en el primer momento de creacion de una configuracion, adjuntando comercios
  objForPointSale = [];
  // id de configuracion aliado empresa despues de creacion de la misma
  idAllyCompanyConfig;
  // objeto para crear configuracion de aliado empresa
  objForconfig;
  // objeto masterfile
  objMasterFile;
  // variable para ip
  clientIp;
  // indica que ya se hizo alguna configuracion
  configurationDone;
  // indica que se actualizo la tabla de auditoria
  updatedAudit: boolean;
  // Borrar registro de primer paso
  cleanRegister: boolean;

  /**
   * Condicional para activar pasos de stepper
   */
  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  /**
   * Condicionales para indicar si se modifico algo en el paso 2 o 3 de las configuraciones
   */
  wasModified2 = false;
  wasModified3 = false;

  dateNow: Date = new Date();
  // numero de tabla para ser usado en el paso 1
  tableNumber = 2;
  allyAuditTableNumber = 2;

  constructor(
    private configurationService: ConfigService,
    private auditService: AuditService,
    private datepipe: DatePipe,
    private allyService: AliadoService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,

  ) { }

  ngOnChanges(changes: SimpleChanges) {
    const cancel = changes['cleanConfig'];
    const save = changes['saveConfig'];

    if (!!cancel) {
      if (cancel.currentValue) {
        this.handleCleanConfig();
      }
    }

    if (!!save) {
      if (!!save.currentValue) {
        setTimeout(() => {
          this.handleSaveConfirmation();
        }, 0.2);
      }
    }
  }

  ngOnInit() {
    this.allyService.getIp();
    this.allySub = this.allyService.getIpListener().subscribe((data) => {
      this.clientIp = data.ip;
    });
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  /**
   *
   * @param step TODO poner numeros con constantes
   */
  changeStep(step) {
    switch (step.selectedIndex) {
      case 0:
        this.tableNumber = 2;
        this.allyAuditTableNumber = 2;
        break;
      case 1:
        this.tableNumber = 3;
        this.allyAuditTableNumber = 2;
        break;
      case 2:
        this.allyAuditTableNumber = 2;
        this.tableNumber = 3;
        break;
      default:
        this.allyAuditTableNumber = 2;
        this.tableNumber = 2;
    }
  }

  /**
   * continuar a paso 2 guardando el registro en variable
   * @param registry registro para seguir a paso 2
   */
  continueToSecondStep(registry) {
    this.registryToConfigure = registry;
    const hasRegistry = {
      registry: registry,
      hasRegistry: true
    };
    // funciona de manera asincrona
    this.isActive1 = true;
    setTimeout(() => {
      this.stepper.next();
      this.registry.emit(hasRegistry);
    }, 0.2);
  }

  /**
 * @param objTradersToConfig Arreglo de traders donde estan los que ya estaba en la tabla y los que se agregaron o quitaron
   */
  handleObjTradersToConfig(objTradersToConfig) {
    this.objTradersConfig = objTradersToConfig;
    this.objTradersConfig.forEach(company => {

      const traderConfig = {
        idAlliedCompanyConfig: null,
        idCompany: company.idCompany,
        idState: 1,
        idCountry: company.idCountry
      };

      this.objForPointSale.push(traderConfig);

    });

    if (this.objTradersConfig && this.objTradersConfig.length !== 0) {
      this.isActive2 = true;
      this.comercialPartners.emit(true);
    } else {
      this.isActive2 = false;
      this.comercialPartners.emit(false);
    }
  }

  /**
   * @param tradersAfterMod  objeto de comercios en modo edicion
   */
  handleObjToCompare(tradersAfterMod) {
    this.tradersAfterMod = tradersAfterMod;
  }

  /**
   * Modificacion del archivo masterfile dependiendo de en que paso se este modificando : edicion/creacion
   * @param objMasterfile archivo cargado
   */
  handleLoadedMasterfile(objMasterfile) {
    if(!!objMasterfile) {
      this.uploadedFile.emit(true);
      const formatedDate = this.datepipe.transform(this.dateNow, 'yMMdHHMMSSm');
      this.wasModified3 = true;
      const userCode = '62454165';
      const objBeforeConfig = {
        idMasterFile: null,
        alliedCompanyConfAudit: {
          idAlliedCompanyConfAudit: null,
        },
        state: {
          idState: 5
        },
        idRoute: objMasterfile.idRoute,
        userName: 'ivaherco',
        master: objMasterfile.master,
        fileName: objMasterfile.fileInfo + '_' + formatedDate + '_' + userCode + '.csv',
        detail: null,
        startDateLoad: null,
        endDateLoad: null,
        fileUpload: objMasterfile.codedfile
      };
      if (this.registryToConfigure.idAlliedCompanyConfig) {
        this.objMasterFile = {
          ...objBeforeConfig,
          idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
        };
      } else {
        this.objMasterFile = {
          ...objBeforeConfig,
          idAlliedCompanyConfig: null,
        };
      }
    } else {
      this.objMasterFile = null;
    }
  }

  /**
   * Limpiar configuraciones y resetear el stepper
   */
  handleCleanConfig() {
    this.registryToConfigure = null;
    this.objTradersConfig = null;
    this.objMasterFile = null;
    this.stepper.reset();
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.cleanConfig = true;
    this.cleanRegister = true;
    this.resetStepper.emit(true);
  }

  checkReset(wasReset) {
    if(wasReset) {
      this.cleanRegister = false;
    }
  }

  /**
   * Evalua si se modifico la tabla 2
   */
  handleTradersModified() {
    this.wasModified2 = false;
    this.tradersAfterMod.forEach(trader => {
      if (trader.idState !== trader.idStateTemp) {
        this.wasModified2 = true;
      }
    });
  }

  handleSaveConfirmation() {
    const dialogRef = this.dialog.open(ModalSaveConfirmationComponent, {
      width: '25%',
      data: { confirm: true, cancel: false }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.handleSave();
      } else {
        setTimeout(() => {
          this.showMessage('Operaci??n Cancelada');
        }, 0.5);
        this.saved.emit(false);
      }
    });
  }

  /**
   * Agregar al paso 2 que ya hay un idAliado
   */
  handleSave() {
    /**
     * Paso 1 creaci??n
     */
    if (!this.registryToConfigure.idAlliedCompanyConfig) {
      if (this.objMasterFile.master === 'PRODUCTS') {
        this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
          if (response === true) {

            const firstConfigObj = {
              allied: { idAllied: this.registryToConfigure.allied.idAllied },
              state: { idState: 2 },
              company: { idCompany: this.registryToConfigure.company.idCompany },
              configurationDate: this.dateNow
            };

            if (!!this.registryToConfigure.idAlliedCompanyConfig) {
              this.objForconfig = {
                ...firstConfigObj,
                idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig
              };
            } else {
              this.objForconfig = {
                ...firstConfigObj,
                idAlliedCompanyConfig: null
              };
            }

            this.configurationService.postFirstConfiguration(this.objForconfig).subscribe((createdConfig) => {
              // Agregar cada socio comercial
              const secondConfigObj = [];

              this.idAllyCompanyConfig = createdConfig['idAlliedCompanyConfig'];

              this.objTradersConfig.forEach(company => {
                const traderConfig = {
                  idAlliedCompanyConfig: this.idAllyCompanyConfig,
                  idCompany: company.idCompany,
                  idState: 1,
                  idCountry: company.idCountry
                };
                secondConfigObj.push(traderConfig);
              });

              this.configurationService.postSecondConfiguration(secondConfigObj).subscribe(() => {
                const objForThirdConfiguration = {
                  ...this.objMasterFile,
                  alliedCompanyConfAudit: null,
                  idAlliedCompanyConfig: this.idAllyCompanyConfig,
                  fileUpload: null
                };

                this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
                  this.saved.emit(true);
                  this.configurationDone = {
                    isDone: true,
                    idAlliedCompanyConfig: this.idAllyCompanyConfig,
                    company: this.registryToConfigure.company.companyCode,
                    ally: this.registryToConfigure.allied.idAllied,
                    state: createdConfig['state'],
                    checkMode: true
                  };
                  this.registryToConfigure.idAlliedCompanyConfig = this.idAllyCompanyConfig;
                  this.registryToConfigure.configurationDate = new Date;
                  setTimeout(() => {
                    this.showMessage('El procesamiento del archivo se har?? de forma desatendida, por favor espere a que se procese');
                  }, 0.8);
                });
              });
            });
          }
        });
      } else {
        this.saved.emit(false);
        setTimeout(() => {
          this.showMessage('Para guardar la configuraci??n se debe tener m??nimo un socio comercial seleccionado y un producto');
        }, 500);
      }
    } else {
      /**
       * Verificar que se modifico paso 2 antes de hacer un seguimiento de los demas cambios
       */
      this.handleTradersModified();
      /**
       * Semodifico paso 2, pero no paso 3
       */
      if (!!this.wasModified2 && !this.wasModified3) {

        /**
         * Objeto para primera auditoria
         */
        const objForconfig = {
          idAlliedCompanyConfAudit: null,
          allied: {
            idAllied: this.registryToConfigure.allied.idAllied
          },
          state: {
            idState: this.registryToConfigure.state.idState
          },
          company: {
            idCompany: this.registryToConfigure.company.idCompany
          },
          actionExecuted: 'Modificaci??n',
          executor: 'ivan hernandez',
          ipOrigin: this.clientIp,
          configurationDate: this.registryToConfigure.configurationDate,
          updateDate: this.dateNow
        };

        /**
         * Colecci??n para segunda configuraci??n y auditor??a
         */
        const configForTraders = [];
        const configforTradersAudit = [];

        this.tradersAfterMod.forEach(trader => {

          if (trader.idState !== trader.idStateTemp) {
            const configTradersAudit = {
              idAlliedTraderConfAudit: null,
              state: {
                idState: trader.idStateTemp
              },
              company: {
                idCompany: trader.idCompany
              }
            };
            configforTradersAudit.push(configTradersAudit);
          }
          if (1 === trader.idStateTemp) {
            const configTraders = {
              idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
              idState: trader.idStateTemp,
              idCompany: trader.idCompany,
              idCountry: trader.idCountry
            };
            configForTraders.push(configTraders);
          }

        });

        this.configurationService.postSecondConfiguration(configForTraders).subscribe(() => {

          this.auditService.creatAllyCompanyConfig(objForconfig).subscribe((response: any) => {
            configforTradersAudit.forEach(config => {
              config.alliedCompanyConfAudit = {
                idAlliedCompanyConfAudit: response.idAlliedCompanyConfAudit
              };
            });

            this.auditService.createTraderAudit(configforTradersAudit).subscribe(() => {
              // Objeto para generar actualizaciones en otros componentes como la auditoria
              this.saved.emit(true);
              this.wasModified2 = false;
              this.configurationDone = {
                isDone: true,
                idAlliedCompanyConfig: this.idAllyCompanyConfig,
                company: this.registryToConfigure.company.idCompany,
                ally: this.registryToConfigure.allied.idAllied
              };
              this.showMessage('Socios comerciales modificados con ??xito');
            });
          });
        });
        /**
         * Se modifico paso 3, pero no paso 2
         */
      } else if (!this.wasModified2 && !!this.wasModified3) {
        const objForconfig = {
          idAlliedCompanyConfAudit: null,
          allied: {
            idAllied: this.registryToConfigure.allied.idAllied
          },
          state: {
            idState: this.registryToConfigure.state.idState
          },
          company: {
            idCompany: this.registryToConfigure.company.idCompany
          },
          actionExecuted: 'Modificaci??n',
          executor: 'ivan hernandez',
          ipOrigin: this.clientIp,
          configurationDate: this.registryToConfigure.configurationDate,
          updateDate: this.dateNow
        };

        this.auditService.creatAllyCompanyConfig(objForconfig).subscribe((responseAudit: any) => {
          this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
            if (response === true) {
              delete this.objMasterFile.alliedCompanyConfAudit;
              const objForThirdConfiguration = {
                ...this.objMasterFile,
                alliedCompanyConfAudit: {
                  idAlliedCompanyConfAudit: responseAudit.idAlliedCompanyConfAudit
                },
                idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
                fileUpload: null
              };
              this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
                this.saved.emit(true);
                this.configurationDone = { isDone: true, idAlliedCompanyConfig: this.idAllyCompanyConfig, companyId: this.registryToConfigure.company.idCompany};
                this.wasModified3 = false;
                this.showMessage('El procesamiento del archivo se har?? de forma desatendida, por favor espere a que se procese');
              });
            }
          });
        });
      } else if (!!this.wasModified2 && !!this.wasModified3) {
        // poner auditoria de lo que dice la hoja
        // this.auditService.creatAllyCompanyConfig()
        const objForconfig = {
          AlliedCompanyConfAudit: {
            idAlliedCompanyConfAudit: null,
          },
          allied: {
            idAllied: this.registryToConfigure.allied.idAllied
          },
          state: {
            idState: this.registryToConfigure.state.idState
          },
          company: {
            idCompany: this.registryToConfigure.company.idCompany
          },
          actionExecuted: 'Modificaci??n',
          executor: 'ivan hernandez',
          ipOrigin: this.clientIp,
          configurationDate: this.registryToConfigure.configurationDate,
          updateDate: this.dateNow
        };

        const configForTraders = [];
        const configforTradersAudit = [];

        this.tradersAfterMod.forEach(trader => {

          if (trader.idState !== trader.idStateTemp) {
            const configTradersAudit = {
              state: {
                idState: trader.idStateTemp
              },
              company: {
                idCompany: trader.idCompany
              }
            };
            configforTradersAudit.push(configTradersAudit);
          }

          if (1 === trader.idStateTemp) {
            const configTraders = {
              idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
              idState: trader.idStateTemp,
              idCompany: trader.idCompany,
              idCountry: trader.idCountry
            };
            configForTraders.push(configTraders);
          }
        });

        this.auditService.creatAllyCompanyConfig(objForconfig).subscribe((responseAudit: any) => {

          configforTradersAudit.forEach(config => {
            config.alliedCompanyConfAudit = {
              idAlliedCompanyConfAudit: responseAudit.idAlliedCompanyConfAudit
            };
          });
          this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
            if (response === true) {

              this.configurationService.postSecondConfiguration(configForTraders).subscribe(() => {
                this.auditService.createTraderAudit(configforTradersAudit).subscribe(() => {
                  delete this.objMasterFile.alliedCompanyConfAudit;
                  const objForThirdConfiguration = {
                    ...this.objMasterFile,
                    idAlliedCompanyConfAudit: null,
                    idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
                    fileUpload: null
                  };

                  this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
                    this.saved.emit(true);

                    this.configurationDone = {
                      isDone: true,
                      idAlliedCompanyConfig: this.idAllyCompanyConfig,
                      company: this.registryToConfigure.company.companyCode,
                      ally: this.registryToConfigure.allied.idAllied
                    };

                    this.wasModified3 = false;
                    this.wasModified2 = false;
                    this.showMessage('Socios comerciales fueron modificados con exito, estamos procesando su archivo');
                  });
                });
              });
            }
          });
        });
      } else if (!this.wasModified3 && !this.wasModified2) {
        setTimeout(() => {
          this.showMessage('No se presentaron cambios, proceso de guardado cancelado');
          this.saved.emit(false);
        }, 0.2);

      }
    }
  }

  handleHasTraders(hasTraders) {
    if (hasTraders === true) {
      this.isActive2 = true;
    }
  }

  handlePreviousStep(goBack) {
    if (goBack) {
      this.stepper.previous();
    }
  }

  showMessage(message) {
    this._snackBar.open(message, 'cerrar', {
      duration: 10000,
    });
  }

  createAllyCompanyConfig(updatedAudit) {
    if (updatedAudit) {
      this.configurationDone = {
        isDone: true,
      };
    }
  }
}
