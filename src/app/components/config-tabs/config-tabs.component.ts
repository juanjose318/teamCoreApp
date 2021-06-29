import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'app-config-tabs',
  templateUrl: './config-tabs.component.html',
  styleUrls: ['./config-tabs.component.scss']
})
export class ConfigTabsComponent implements OnInit {
  @Input() selectedAlly;
  @Input() selectedCompany;

  @ViewChild(MatStepper) stepper: MatStepper;

  registryToConfigure;

  objTradersConfig;

  objAllyCompanyAuditCollection;

  tableNumber = 2;
  allyAuditTableNumber = 2;
  constructor() { }

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
    console.log(this.tableNumber);
    this.stepper.next();
  }

  handleObjTradersToConfig(objTradersToConfig){
    this.objTradersConfig = objTradersToConfig;
    console.log(this.objTradersConfig);
  }

  createAllyCompanyConfig(objAllyCompanyAudit){
    this.objAllyCompanyAuditCollection = objAllyCompanyAudit;
  }

  ngOnInit() {
  }

}
