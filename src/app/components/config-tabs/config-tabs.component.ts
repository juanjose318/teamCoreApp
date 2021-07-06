import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';
import { ProductService } from 'src/app/services/products/products.service';
import { AngularCsv } from 'angular7-csv';

@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss']
})
export class ConfigTabsComponent implements OnChanges {
  @Input() selectedAlly;
  @Input() selectedCompany;
  @Input() cleanConfig;

  @Output() resetStepper: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(MatStepper) stepper: MatStepper;

  registryToConfigure;

  objTradersConfig;

  objAllyCompanyAuditCollection;

  isActive1: boolean;
  isActive2: boolean;
  isActive3: boolean;

  tableNumber = 2;
  allyAuditTableNumber = 2;
  constructor(
    private productService: ProductService,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    let change = changes['cleanConfig'];
    if (!!change) {
      if (change.currentValue) {
          this.handleCleanConfig();      
      }
    }
  }

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
        this.allyAuditTableNumber = 4;
        this.tableNumber = 4;
        break;
      default:
        this.allyAuditTableNumber = 2;
        this.tableNumber = 2;
    }
  }

  continueToSecondStep(registry) {
    this.registryToConfigure = registry;
    this.isActive1 = true;
    console.log(this.registryToConfigure);
    setTimeout(() => {
      this.stepper.next();

    }, 0.2);
  }

  handleObjTradersToConfig(objTradersToConfig) {
    this.objTradersConfig = objTradersToConfig;
    if (this.objTradersConfig.length !== 0) {
      this.isActive2 = true;
    }
    console.log(objTradersToConfig);
  }

  handleCleanConfig() {
    this.registryToConfigure = null;
    this.objTradersConfig = null;
    this.stepper.reset();
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.resetStepper.emit(true);
  }

  createAllyCompanyConfig(objAllyCompanyAudit) {
    this.objAllyCompanyAuditCollection = objAllyCompanyAudit;
  }

  handleCsv(download){
    console.log(this.registryToConfigure);
    if(download){
      // this.productService.getProductsByCompany(this.companyId);
      // this.productService.getProductListener().subscribe((data) => {
      //   console.info(data.products);
      //   new AngularCsv(data.products, 'Reporte Productos');
      // });
    }
  }

}
