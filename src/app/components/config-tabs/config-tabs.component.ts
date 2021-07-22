import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar, MatStepper } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/services/config/config.service';
import { ProductService } from 'src/app/services/products/products.service';
import { AuditService } from 'src/app/services/audit/audit.service';
import { AliadoService } from 'src/app/services/ally/ally.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss'],
})
export class ConfigTabsComponent implements OnChanges, OnInit {
  @Input() selectedAlly;
  @Input() selectedCompany;
  @Input() cleanConfig;
  @Input() saveConfig;

  @Output() resetStepper: EventEmitter<boolean> = new EventEmitter();
  @Output() OutisLoading: EventEmitter<boolean> = new EventEmitter();

  @Output() registry: EventEmitter<any> = new EventEmitter();
  @Output() comercialPartners: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatStepper) stepper: MatStepper;

  private allySub: Subscription;

  isLoading: boolean;

  registryToConfigure;

  objTradersConfig;
  tradersAfterMod;
  objAllyCompanyAuditCollection;
  objForPointSale = [];
  idAllyCompanyConfig;
  objForconfig;
  objMasterFile;

  clientIp;

  configurationDone;

  /**
   * Condicional para activar pasos de stepper
   */
  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  /**
   * Condicionales para indicar si se modifico algo en el paso 2 o 3 de las configuraciones
   */
  wasModified2: boolean = false;
  wasModified3: boolean = false;

  dateNow: Date = new Date();

  tableNumber = 2;
  allyAuditTableNumber = 2;
  constructor(
    private configurationService: ConfigService,
    private auditService: AuditService,
    private datepipe: DatePipe,
    private allyService: AliadoService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    let cancel = changes['cleanConfig'];
    let save = changes['saveConfig'];
    if (!!cancel) {
      if (cancel.currentValue) {
        this.handleCleanConfig();
      }
    }
    if (!!save) {
      if (!!save.currentValue) {
        this.handleSave();
      }
    }
  }

  ngOnInit() {
    this.allyService.getIp();
    this.allySub = this.allyService.getIpListener().subscribe((data) => {
      this.clientIp = data.ip;
    });
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

  continueToSecondStep(registry) {
    this.registryToConfigure = registry;
    // console.log(this.registryToConfigure);
    this.isActive1 = true;
    setTimeout(() => {
      this.stepper.next();
      this.registry.emit(true);
    }, 0.2);
  }

  /**
   * @param objTradersToConfig Arreglo de traders donde estan los que ya estaba en la tabla y los que se agregaron o quitaron
   */
  handleObjTradersToConfig(objTradersToConfig) {
    this.objTradersConfig = objTradersToConfig;

    this.objTradersConfig.forEach(company => {

      let traderConfig = {
        idAlliedCompanyConfig: null,
        idCompany: company.idCompany,
        idState: 1,
        idCountry: company.idCountry
      }

      this.objForPointSale.push(traderConfig);

    });

    if (this.objTradersConfig && this.objTradersConfig.length !== 0) {
      this.isActive2 = true;
      this.comercialPartners.emit(true);
    }
  }

  handleObjToCompare(tradersAfterMod) {
    // console.log(tradersAfterMod);
    this.tradersAfterMod = tradersAfterMod;
  }


  handleLoadedMasterfile(objMasterfile) {
    // console.log(objMasterfile);
    let formatedDate = this.datepipe.transform(this.dateNow, 'yMMdHHMMSSm');
    this.wasModified3 = true;
    let userCode = '62454165';
    // console.log(this.registryToConfigure);
    let objBeforeConfig = {
      idMasterFile: null,
      idAlliedCompanyConfAudit: null,
      state: {
        idState: 5
      },
      idRoute: objMasterfile.idRoute,
      userName: "ivaherco",
      master: objMasterfile.master,
      fileName: objMasterfile.fileInfo + '_' + formatedDate + '_' + userCode + '.csv',
      detail: null,
      startDateLoad: null,
      endDateLoad: null,
      fileUpload: objMasterfile.codedfile
    }

    if (this.registryToConfigure.idAlliedCompanyConfig) {
      this.objMasterFile = {
        ...objBeforeConfig,
        idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
      }
    } else {
      this.objMasterFile = {
        ...objBeforeConfig,
        idAlliedCompanyConfig: null,
      }
    }
    // console.log(this.objMasterFile);
  }

  handleCleanConfig() {
    this.registryToConfigure = null;
    this.objTradersConfig = null;
    this.objMasterFile = null
    this.stepper.reset();
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.resetStepper.emit(true);
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

    setTimeout(() => {
      this.stepper.next();
    }, 0.2);
  }

  /**
   * Agregar al paso 2 que ya hay un idAliado
   */
  handleSave() {
    /**
     * Paso 1 creacióm
     */
    if (!this.registryToConfigure.idAlliedCompanyConfig) {
      this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
        if (response === true) {

          let firstConfigObj = {
            allied: { idAllied: this.registryToConfigure.allied.idAllied },
            state: { idState: 2 },
            company: { idCompany: this.registryToConfigure.company.idCompany },
            configurationDate: this.dateNow
          }

          if (!!this.registryToConfigure.idAlliedCompanyConfig) {
            this.objForconfig = {
              ...firstConfigObj,
              idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig
            }
          } else {
            this.objForconfig = {
              ...firstConfigObj,
              idAlliedCompanyConfig: null
            }
          }

          this.configurationService.postFirstConfiguration(this.objForconfig).subscribe((createdConfig) => {
            // Agregar cada socio comercial
            let secondConfigObj = [];

            this.idAllyCompanyConfig = createdConfig['idAlliedCompanyConfig'];

            this.objTradersConfig.forEach(company => {
              let traderConfig = {
                idAlliedCompanyConfig: this.idAllyCompanyConfig,
                idCompany: company.idCompany,
                idState: 1,
                idCountry: company.idCountry
              }
              secondConfigObj.push(traderConfig);
            });

            this.configurationService.postSecondConfiguration(secondConfigObj).subscribe((createdConfig) => {
              let objForThirdConfiguration = {
                ...this.objMasterFile,
                idAlliedCompanyConfig: this.idAllyCompanyConfig,
                fileUpload: null
              }

              this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
                this.configurationDone = { isDone: true, idAlliedCompanyConfig: this.idAllyCompanyConfig };
                this._snackBar.open("El procesamiento del archivo se hará de forma desatendida, por favor espere a que se procese", 'cerrar', {
                  duration: 10000,
                });
              });
            })
          });
        }
      });

    } else {
      if (!!this.wasModified2 && !this.wasModified3) {

        /**
         * Objeto para primera auditoria
         */
        let objForconfig = {
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
          actionExecuted: "NAA",
          "executor": "ivan hernandez",
          ipOrigin: this.clientIp,
          configurationDate: this.registryToConfigure.configurationDate,
          updateDate: this.dateNow
        };

        /**
         * Colección para segunda configuració y auditoría
         */
        let configForTraders = [];
        let configforTradersAudit = [];

        this.tradersAfterMod.forEach(trader => {

          if (trader.idState !== trader.idStateTemp) {
            // console.log("guardar en AlliedTraderConfAudit con el idStateTemp: " + trader.idStateTemp);
            let configTradersAudit = {
              idAlliedTraderConfAudit: null,
              state: {
                idState: trader.idStateTemp
              },
              company: {
                idCompany: trader.idCompany
              }
            }
            configforTradersAudit.push(configTradersAudit);
          }
          // console.log(configforTradersAudit);
          if (1 === trader.idStateTemp) {
            // console.log("guardar en AlliedTraderConfig con el idState: " + trader.idStateTemp);
            let configTraders = {
              idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
              idState: trader.idStateTemp,
              idCompany: trader.idCompany,
              idCountry: trader.idCountry
            }
            configForTraders.push(configTraders);
          }
        });

        this.configurationService.postSecondConfiguration(configForTraders).subscribe(() => {

          this.auditService.creatAllyCompanyConfig(objForconfig).subscribe((response: any) => {
            configforTradersAudit.forEach(config => {
              config.alliedCompanyConfAudit = {
                idAlliedCompanyConfAudit: response.idAlliedCompanyConfAudit
              }
            });
            this.auditService.createTraderAudit(configforTradersAudit).subscribe(() => {
              //objeto para generar actualizaciones en otros componentes como la auditoria
              this.configurationDone = { isDone: true, idAlliedCompanyConfig: this.idAllyCompanyConfig, company: this.registryToConfigure.company.idCompany, ally: this.registryToConfigure.allied.idAllied };
              this._snackBar.open("El procesamiento del archivo se hará de forma desatendida, por favor espere a que se procese", 'cerrar', {
                duration: 10000,
              });
            })
          })
        })

      } else if (!this.wasModified2 && !!this.wasModified3) {
        this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
          if (response === true) {
            let objForThirdConfiguration = {
              ...this.objMasterFile,
              idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
              fileUpload: null
            }
            // console.log(objForThirdConfiguration);
            this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
              this.configurationDone = { isDone: true, idAlliedCompanyConfig: this.idAllyCompanyConfig };
              this._snackBar.open("El procesamiento del archivo se hará de forma desatendida, por favor espere a que se procese", 'cerrar', {
                duration: 10000,
              });
            })
          }
        });
      } else if (!!this.wasModified2 && !!this.wasModified3) {
        this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
          if (response === true) {

            let configForTraders = [];
            let configforTradersAudit = [];

            this.tradersAfterMod.forEach(trader => {

              if (trader.idState !== trader.idStateTemp) {
                // console.log("guardar en AlliedTraderConfAudit con el idStateTemp: " + trader.idStateTemp);
                let configTradersAudit = {
                  idAlliedTraderConfAudit: null,
                  state: {
                    idState: trader.idStateTemp
                  },
                  company: {
                    idCompany: trader.idCompany
                  }
                }
                configforTradersAudit.push(configTradersAudit);
              }

              if (1 === trader.idStateTemp) {
                // console.log("guardar en AlliedTraderConfig con el idState: " + trader.idStateTemp);
                let configTraders = {
                  idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
                  idState: trader.idStateTemp,
                  idCompany: trader.idCompany,
                  idCountry: trader.idCountry
                }
                configForTraders.push(configTraders);
              }
            });

            this.configurationService.postSecondConfiguration(configForTraders).subscribe(() => {

              let objForThirdConfiguration = {
                ...this.objMasterFile,
                idAlliedCompanyConfig: this.registryToConfigure.idAlliedCompanyConfig,
                fileUpload: null
              };
              this.configurationService.postThirdConfiguration(objForThirdConfiguration).subscribe(() => {
                this.configurationDone = { isDone: true, idAlliedCompanyConfig: this.idAllyCompanyConfig, company: this.registryToConfigure.company.idCompany, ally: this.registryToConfigure.allied.idAllied };
                this._snackBar.open("El procesamiento del archivo se hará de forma desatendida, por favor espere a que se procese", 'cerrar', {
                  duration: 10000,
                });
              })
            });
          }
        });
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

  createAllyCompanyConfig(objAllyCompanyAudit) {
    this.objAllyCompanyAuditCollection = objAllyCompanyAudit;
  }

  // handleIsloading(loading) {
  //   (loading === true) ? this.isLoading = true : this.isLoading = false
  // }

}
