import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar, MatStepper } from '@angular/material';
import { DatePipe } from '@angular/common';
import { ConfigService } from 'src/app/services/config/config.service';
import { ProductService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss'],
})
export class ConfigTabsComponent implements OnChanges {
  @Input() selectedAlly;
  @Input() selectedCompany;
  @Input() cleanConfig;
  @Input() saveConfig;

  @Output() resetStepper: EventEmitter<boolean> = new EventEmitter();
  @Output() OutisLoading: EventEmitter<boolean> = new EventEmitter();

  @Output() registry: EventEmitter<any> = new EventEmitter();
  @Output() comercialPartners: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatStepper) stepper: MatStepper;

  isLoading: boolean;

  registryToConfigure;

  objTradersConfig;

  objAllyCompanyAuditCollection;

  objForPointSale = [];

  idAllyCompanyConfig;

  objMasterFile;

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  dateNow: Date = new Date();

  tableNumber = 2;
  allyAuditTableNumber = 2;
  constructor(
    private productService: ProductService,
    private configurationService: ConfigService,
    public datepipe: DatePipe,
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
    console.log(registry);
    this.registryToConfigure = registry;
    this.isActive1 = true;
    setTimeout(() => {
      this.stepper.next();
      this.registry.emit(true);
    }, 0.2);
  }

  handleObjTradersToConfig(objTradersToConfig) {
    this.objTradersConfig = objTradersToConfig;

    objTradersToConfig.forEach(company => {

      let traderConfig = {
        idAlliedCompanyConfig: null,
        idCompany: company.idCompany,
        idState: 1,
        idCountry: company.idCountry
      }

      this.objForPointSale.push(traderConfig);

    });

    console.log(objTradersToConfig)

    if (this.objTradersConfig && this.objTradersConfig.length !== 0) {
      this.isActive2 = true;
      this.comercialPartners.emit(true);
    }
  }

  handleLoadedMasterfile(objMasterfile) {
    console.log(objMasterfile);
    let formatedDate = this.datepipe.transform(this.dateNow, 'yMMdHHMMSSm');
    let userCode = '62454165';

    this.objMasterFile = {
      idAlliedCompanyConfig: null,
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
    console.log(this.objMasterFile);
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

  handleSave() {
    console.log(this.objMasterFile);
    this.configurationService.postMasterfile(this.objMasterFile).subscribe((response) => {
      console.log(response);
      if (response === true) {
        let firstConfigObj = {
          idAlliedCompanyConfig: null,
          allied: { idAllied: this.registryToConfigure.allied.idAllied },
          state: { idState: 2 },
          company: { idCompany: this.registryToConfigure.company.idCompany },
          configurationDate: this.dateNow
        }
        this.configurationService.postFirstConfiguration(firstConfigObj).subscribe((createdConfig) => {

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
              this._snackBar.open(" El procesamiento del archivo se hará de forma desatendida, por favor espere a que se procese", 'cerrar', {
                duration: 10000,
              });
            });
          })
        });
      }
    });
  }

  handlePreviousStep(goBack) {
    if (goBack) {
      this.stepper.previous();
    }
  }

  handleDownload($event) {

  }

  createAllyCompanyConfig(objAllyCompanyAudit) {
    this.objAllyCompanyAuditCollection = objAllyCompanyAudit;
  }

  // handleIsloading(loading) {
  //   (loading === true) ? this.isLoading = true : this.isLoading = false
  // }

}
